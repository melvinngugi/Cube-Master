import express from "express";
import {
  createSolve,
  getSolvesByUser,
  deleteSolve,
  togglePlusTwo,
} from "../controllers/solveController.js";

const router = express.Router();

//POST /api/v1/solves - save a solve
router.post("/", createSolve);

//GET /api/v1/solves/:userId - fetch solves for a user
router.get("/:userId", getSolvesByUser);

//DELETE /api/v1/solves/:solveId - delete a solve
router.delete("/:solveId", deleteSolve);

//PUT /api/v1/solves/:solveId/plus2 - toggle +2 penalty
router.put("/:solveId/plus2", togglePlusTwo);

export default router;
