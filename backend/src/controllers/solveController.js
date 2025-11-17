import oracledb from "oracledb";
import { execute } from "../db/oracle.js";

// Save scramble and solve
export const createSolve = async (req, res) => {
  try {
    const {
      user_id, // must match USERS.ID
      scramble_text,
      solve_time,
      beginner_generated_solution,
      advanced_generated_solution,
    } = req.body;

    if (!scramble_text || !user_id || !solve_time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Saving solve for user_id:", user_id);

    //Insert scramble into SCRAMBLE table and return SCRAMBLE_ID
    const scrambleResult = await execute(
      `INSERT INTO Scramble (CUBE_ID, SOURCE, DATE_GENERATED, SCRAMBLE_TEXT)
       VALUES (:cube_id, :source, CURRENT_TIMESTAMP, :scramble_text)
       RETURNING SCRAMBLE_ID INTO :scramble_id`,
      {
        cube_id: 1, // assuming 3x3 cube; adjust if dynamic
        source: "frontend",
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

    //Insert solve into SOLVERECORD table linked to scramble
    await execute(
      `INSERT INTO SolveRecord 
        (user_id, scramble_id, solve_time, beginner_generated_solution, advanced_generated_solution, timestamp)
       VALUES (:user_id, :scramble_id, :solve_time, :beginner_generated_solution, :advanced_generated_solution, CURRENT_TIMESTAMP)`,
      {
        user_id, // must exist in USERS.ID
        scramble_id: scrambleId,
        solve_time,
        beginner_generated_solution,
        advanced_generated_solution,
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: "Solve saved successfully",
      scrambleId,
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
              sr.solve_time,
              sr.timestamp,
              sr.beginner_generated_solution,
              sr.advanced_generated_solution,
              s.scramble_text
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
