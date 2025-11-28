import express from "express";
import { execute } from "../db/oracle.js";

const router = express.Router();

// GET /api/v1/algorithms?category=OLL or PLL
router.get("/algorithms", async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: "Missing category. Use ?category=OLL or ?category=PLL" });
  }

  try {
    const sql = `
      SELECT ALGORITHM_ID, NAME, CATEGORY, MOVE_SEQUENCE
      FROM ALGORITHM
      WHERE CATEGORY = :category
      ORDER BY ALGORITHM_ID
    `;
    const result = await execute(sql, { category });
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching algorithms:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

export default router;
