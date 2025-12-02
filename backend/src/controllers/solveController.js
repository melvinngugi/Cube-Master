// backend/src/controllers/solveController.js
import oracledb from "oracledb";
import { execute } from "../db/oracle.js";
import {
  generateBeginner2LookCFOP,
  generateXCrossCFOP,
  generateXXCrossCFOP,
  generateXXXCrossCFOP,
} from "../services/cfopGenerator.js";

// Save scramble and solve
export const createSolve = async (req, res) => {
  try {
    const {
      user_id,
      scramble_text,
      solve_time,
      cube_id, // now read from body
    } = req.body;

    if (!scramble_text || !user_id || solve_time == null || !cube_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Saving solve for user_id:", user_id, "cube_id:", cube_id);

    // Insert scramble into SCRAMBLE table and return SCRAMBLE_ID
    const scrambleResult = await execute(
      `INSERT INTO Scramble (CUBE_ID, SOURCE, DATE_GENERATED, SCRAMBLE_TEXT)
       VALUES (:cube_id, :source, CURRENT_TIMESTAMP, :scramble_text)
       RETURNING SCRAMBLE_ID INTO :scramble_id`,
      {
        cube_id,
        source: "cubing.js",
        scramble_text,
        scramble_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    const scrambleId = scrambleResult.outBinds.scramble_id[0];
    console.log("Inserted scrambleId:", scrambleId);

    if (!scrambleId) {
      return res.status(500).json({ message: "Failed to insert scramble" });
    }

    // Generate solutions only for 3x3
    let beginner = null;
    let xcross = null;
    let xxcross = null;
    let xxxcross = null;

    if (cube_id === 1) {
      beginner = await generateBeginner2LookCFOP(scramble_text);
      xcross = await generateXCrossCFOP(scramble_text);
      xxcross = await generateXXCrossCFOP(scramble_text);
      xxxcross = await generateXXXCrossCFOP(scramble_text);
    }

    // Insert solve into SOLVERECORD table linked to scramble
    const solveResult = await execute(
      `INSERT INTO SolveRecord (
        user_id, scramble_id, cube_id, solve_time, timestamp,
        BEGINNER_GENERATED_CROSS,
        XCROSS_GENERATED_CROSS,
        XXCROSS_GENERATED_CROSS,
        XXXCROSS_GENERATED_CROSS
      )
      VALUES (
        :user_id, :scramble_id, :cube_id, :solve_time, CURRENT_TIMESTAMP,
        :beginner, :xcross, :xxcross, :xxxcross
      )
      RETURNING solve_id INTO :solve_id`,
      {
        user_id,
        scramble_id: scrambleId,
        cube_id,
        solve_time,
        beginner: beginner ? beginner.moves : null,
        xcross: xcross ? xcross.moves : null,
        xxcross: xxcross ? xxcross.moves : null,
        xxxcross: xxxcross ? xxxcross.moves : null,
        solve_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    const solveId = solveResult.outBinds.solve_id[0];

    res.status(201).json({
      message: "Solve saved successfully",
      scrambleId,
      solveId,
      cube_id,
      solutions: {
        beginner: beginner ? beginner.moves : null,
        xcross: xcross ? xcross.moves : null,
        xxcross: xxcross ? xxcross.moves : null,
        xxxcross: xxxcross ? xxxcross.moves : null,
      },
    });
  } catch (error) {
    console.error("Solve insert error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch solves by user
export const getSolvesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await execute(
      `SELECT sr.solve_id,
              sr.user_id,
              sr.scramble_id,
              sr.cube_id,
              sr.solve_time,
              sr.timestamp,
              sr.BEGINNER_GENERATED_CROSS,
              sr.XCROSS_GENERATED_CROSS,
              sr.XXCROSS_GENERATED_CROSS,
              sr.XXXCROSS_GENERATED_CROSS,
              s.scramble_text,
              s.cube_id AS scramble_cube_id
       FROM SolveRecord sr
       JOIN Scramble s ON sr.scramble_id = s.scramble_id
       WHERE sr.user_id = :userId
       ORDER BY sr.timestamp DESC`,
      { userId }
    );

    res.json({ solves: result.rows });
  } catch (error) {
    console.error("Fetch solves error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
