import oracledb from "oracledb";
import { execute } from "../db/oracle.js";
import {
  generateBeginner2LookCFOP,
  generateXCrossCFOP,
  generateXXCrossCFOP,
  generateXXXCrossCFOP,
} from "../services/cfopGenerator.js";

//Save scramble and solve
export const createSolve = async (req, res) => {
  try {
    const { user_id, scramble_text, solve_time, cube_id } = req.body;

    if (!scramble_text || !user_id || solve_time == null || !cube_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Creating solve:", { user_id, scramble_text, solve_time, cube_id });

    //Insert scramble
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

    //Generate solutions only for 3x3
    let beginner = null, xcross = null, xxcross = null, xxxcross = null;
    if (cube_id === 1) {
      beginner = await generateBeginner2LookCFOP(scramble_text);
      xcross = await generateXCrossCFOP(scramble_text);
      xxcross = await generateXXCrossCFOP(scramble_text);
      xxxcross = await generateXXXCrossCFOP(scramble_text);
    }

    //Insert solve
    const solveResult = await execute(
      `INSERT INTO SolveRecord (
        user_id, scramble_id, cube_id, solve_time, timestamp,
        BEGINNER_GENERATED_CROSS,
        XCROSS_GENERATED_CROSS,
        XXCROSS_GENERATED_CROSS,
        XXXCROSS_GENERATED_CROSS,
        PLUS_TWO
      )
      VALUES (
        :user_id, :scramble_id, :cube_id, :solve_time, CURRENT_TIMESTAMP,
        :beginner, :xcross, :xxcross, :xxxcross, 0
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
    console.log("Inserted solveId:", solveId);

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

//Fetch solves by user
export const getSolvesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching solves for userId:", userId);

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
              sr.PLUS_TWO,
              s.scramble_text,
              s.cube_id AS scramble_cube_id
       FROM SolveRecord sr
       JOIN Scramble s ON sr.scramble_id = s.scramble_id
       WHERE sr.user_id = :userId
       ORDER BY sr.timestamp DESC`,
      { userId }
    );

    console.log("Fetched solves count:", result.rows.length);
    res.json({ solves: result.rows });
  } catch (error) {
    console.error("Fetch solves error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Toggle +2 penalty
export const togglePlusTwo = async (req, res) => {
  try {
    const solveId = Number(req.params.solveId);
    console.log("togglePlusTwo called for solveId:", solveId, typeof solveId);

    const result = await execute(
      `SELECT 
         SOLVE_TIME AS "SOLVE_TIME",
         PLUS_TWO AS "PLUS_TWO"
       FROM SolveRecord 
       WHERE SOLVE_ID = :solveId`,
      { solveId }
    );

    if (result.rows.length === 0) {
      console.warn("Solve not found for toggle:", solveId);
      return res.status(404).json({ message: "Solve not found" });
    }

    const row = result.rows[0];
    const rawTime = row.SOLVE_TIME;
    const rawPlusTwo = row.PLUS_TWO;

    console.log("Raw values from DB:", { rawTime, rawPlusTwo });

    const currentTime = rawTime == null ? 0 : parseFloat(rawTime);
    const plusTwo = Number(rawPlusTwo) === 1;

    if (Number.isNaN(currentTime)) {
      console.error("Invalid solve_time in DB:", rawTime);
      return res.status(500).json({ message: "Invalid solve_time in DB", rawTime });
    }

    let newTime, newPlusTwo;
    if (plusTwo) {
      newTime = currentTime - 2000;
      newPlusTwo = 0;
    } else {
      newTime = currentTime + 2000;
      newPlusTwo = 1;
    }

    console.log("Updating solve:", { solveId, newTime, newPlusTwo });

    await execute(
      `UPDATE SolveRecord
       SET SOLVE_TIME = :newTime, PLUS_TWO = :newPlusTwo
       WHERE SOLVE_ID = :solveId`,
      { solveId, newTime, newPlusTwo },
      { autoCommit: true }
    );

    res.status(200).json({
      message: "Toggled +2",
      solveId,
      plus_two: newPlusTwo,
      newTime,
    });
  } catch (error) {
    console.error("Toggle +2 error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Delete solve
export const deleteSolve = async (req, res) => {
  try {
    const { solveId } = req.params;
    console.log("Deleting solveId:", solveId);

    const result = await execute(
      `DELETE FROM SolveRecord WHERE solve_id = :solveId`,
      { solveId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      console.warn("Solve not found for delete:", solveId);
      return res.status(404).json({ message: "Solve not found" });
    }

    console.log("Deleted solveId:", solveId);
    res.status(200).json({ message: "Solve deleted successfully", solveId });
  } catch (error) {
    console.error("Delete solve error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
