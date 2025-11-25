import express from "express";
import { generateBeginner2LookCFOP } from "../services/cfopGenerator.js";

const router = express.Router();

// Define your endpoint(s)
router.post("/solutions/beginner", async (req, res) => {
  try {
    const { scramble } = req.body;
    if (!scramble || typeof scramble !== "string") {
      return res.status(400).json({ error: "Missing or invalid scramble" });
    }

    const solution = await generateBeginner2LookCFOP(scramble);
    res.json(solution);
  } catch (err) {
    console.error("Solution generation failed:", err);
    res.status(500).json({ error: "Failed to generate solution" });
  }
});

// Export the router as default
export default router;
