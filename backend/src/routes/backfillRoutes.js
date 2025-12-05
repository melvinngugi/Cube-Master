import express from "express";
import { backfillSolves } from "../controllers/backfillController.js";

const router = express.Router();

router.post("/solves/backfill", backfillSolves);

export default router;
