import express from "express";
import { execute } from "../db/oracle.js";

const router = express.Router();

router.get("/progress", async (req, res) => {
  const { userId } = req.query;
  try {
    const sql = `
      SELECT p.USER_ID, p.ALGORITHM_ID, p.STATUS, a.CATEGORY
      FROM USER_ALGORITHM_PROGRESS p
      JOIN ALGORITHM a ON p.ALGORITHM_ID = a.ALGORITHM_ID
      WHERE p.USER_ID = :userId
    `;
    const result = await execute(sql, { userId });
    res.json(result.rows);
  } catch (err) {
    console.error("SQL execution error:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

router.post("/progress", async (req, res) => {
  const { userId, algorithmId, status } = req.body;
  try {
    const sql = `
      MERGE INTO USER_ALGORITHM_PROGRESS p
      USING (SELECT :userId AS USER_ID, :algorithmId AS ALGORITHM_ID FROM dual) src
      ON (p.USER_ID = src.USER_ID AND p.ALGORITHM_ID = src.ALGORITHM_ID)
      WHEN MATCHED THEN UPDATE SET STATUS = :status
      WHEN NOT MATCHED THEN INSERT (USER_ID, ALGORITHM_ID, STATUS)
      VALUES (:userId, :algorithmId, :status)
    `;
    await execute(sql, { userId, algorithmId, status }, { autoCommit: true });
    res.json({ success: true });
  } catch (err) {
    console.error("SQL execution error:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

export default router;
