import express from "express";
import { execute } from "../db/oracle.js";

const router = express.Router();

router.get("/algorithms", async (req, res) => {
  const { category } = req.query;

  let sql;
  if (category === "OLL") {
    sql = `SELECT ALGORITHM_ID, NAME, CATEGORY, MOVE_SEQUENCE FROM ALGORITHM WHERE ALGORITHM_ID BETWEEN 1 AND 57 ORDER BY ALGORITHM_ID`;
  } else if (category === "PLL") {
    sql = `SELECT ALGORITHM_ID, NAME, CATEGORY, MOVE_SEQUENCE FROM ALGORITHM WHERE ALGORITHM_ID BETWEEN 101 AND 121 ORDER BY ALGORITHM_ID`;
  } else if (category === "2LOOK_OLL") {
    sql = `SELECT ALGORITHM_ID, NAME, CATEGORY, MOVE_SEQUENCE FROM ALGORITHM WHERE ALGORITHM_ID BETWEEN 201 AND 210 ORDER BY ALGORITHM_ID`;
  } else if (category === "2LOOK_PLL") {
    sql = `SELECT ALGORITHM_ID, NAME, CATEGORY, MOVE_SEQUENCE FROM ALGORITHM WHERE ALGORITHM_ID BETWEEN 301 AND 306 ORDER BY ALGORITHM_ID`;
  } else {
    return res.status(400).json({ error: "Invalid category" });
  }

  try {
    const result = await execute(sql);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching algorithms:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});


export default router;
