// backend/src/services/cfopGenerator.js
import { CubeState } from "./cubeModel.js";
import { solveWhiteCross } from "./crossSolver.js";
import { replaceLastLayerWithBeginner2Look } from "./lastLayer.js";
import { normalizeMoves, optimizeMoves } from "../utils/moveUtils.js";

export async function generateBeginner2LookCFOP(scramble) {
  // Build cube from scramble
  const cs = new CubeState(scramble);

  // Cross (pass scramble string and the CubeState)
  const crossMoves = solveWhiteCross(scramble, cs);

  // F2L placeholder
  const f2lMoves = "";

  // Last layer replacement (as you already have)
  const { llCombined, llSteps } = await replaceLastLayerWithBeginner2Look({});

  const merged = normalizeMoves(`${crossMoves} ${f2lMoves} ${llCombined}`.trim());
  const optimized = optimizeMoves(merged);

  const steps = [
    { label: "Cross", moves: crossMoves },
    ...llSteps,
  ];

  return {
    method: "CFOP",
    profile: "beginner-2look",
    steps,
    moves: optimized,
    meta: { replacedLL: true, source: "cfop-beginner-v1" },
  };
}
