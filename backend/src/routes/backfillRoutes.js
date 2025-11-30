import express from "express";
import { backfillSolves } from "../controllers/backfillController.js";

const router = express.Router();

// POST /api/v1/solves/backfill → run migration
router.post("/solves/backfill", backfillSolves);

export default router;
