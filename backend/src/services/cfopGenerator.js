// backend/src/services/cfopGenerator.js
import { CubeState } from "./cubeModel.js";
import { solveCross } from "./crossSolver.js";
import { normalizeMoves, optimizeMoves } from "../utils/moveUtils.js";

export async function generateBeginner2LookCFOP(scramble) {
  const cs = new CubeState(scramble);

  // Cross using csTimer’s module
  const crossMoves = solveCross(scramble);

  const steps = [
    { label: "Cross", moves: crossMoves },
  ];

  // Normalize + optimize the moves string
  const normalized = normalizeMoves(crossMoves);
  const optimized = optimizeMoves(normalized);

  return {
    method: "CFOP",
    profile: "beginner-2look",
    steps,
    moves: optimized,
    meta: { source: "cfop-cstimer-cross" },
  };
}
