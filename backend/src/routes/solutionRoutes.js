import express from "express";
import {
  generateBeginner2LookCFOP,
  generateXCrossCFOP,
  generateXXCrossCFOP,
  generateXXXCrossCFOP,
} from "../services/cfopGenerator.js";

const router = express.Router();

//Beginner CFOP
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

//XCross CFOP
router.post("/solutions/xcross", async (req, res) => {
  try {
    const { scramble } = req.body;
    if (!scramble || typeof scramble !== "string") {
      return res.status(400).json({ error: "Missing or invalid scramble" });
    }
    const solution = await generateXCrossCFOP(scramble);
    res.json(solution);
  } catch (err) {
    console.error("Solution generation failed:", err);
    res.status(500).json({ error: "Failed to generate solution" });
  }
});

//XXCross CFOP
router.post("/solutions/xxcross", async (req, res) => {
  try {
    const { scramble } = req.body;
    if (!scramble || typeof scramble !== "string") {
      return res.status(400).json({ error: "Missing or invalid scramble" });
    }
    const solution = await generateXXCrossCFOP(scramble);
    res.json(solution);
  } catch (err) {
    console.error("Solution generation failed:", err);
    res.status(500).json({ error: "Failed to generate solution" });
  }
});

//XXXCross CFOP
router.post("/solutions/xxxcross", async (req, res) => {
  try {
    const { scramble } = req.body;
    if (!scramble || typeof scramble !== "string") {
      return res.status(400).json({ error: "Missing or invalid scramble" });
    }
    const solution = await generateXXXCrossCFOP(scramble);
    res.json(solution);
  } catch (err) {
    console.error("Solution generation failed:", err);
    res.status(500).json({ error: "Failed to generate solution" });
  }
});

export default router;
