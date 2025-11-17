import express from "express";
import { createSolve, getSolvesByUser } from "../controllers/solveController.js";

const router = express.Router();

// POST /api/v1/solves → save a solve
router.post("/", createSolve);

// GET /api/v1/solves/:userId → fetch solves for a user
router.get("/:userId", getSolvesByUser);

export default router;
