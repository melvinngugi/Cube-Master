import { CubeState } from "./cubeModel.js";
import { solveWhiteCross } from "./crossSolver.js";
import { replaceLastLayerWithBeginner2Look } from "./lastLayer.js";
import { normalizeMoves, optimizeMoves } from "../utils/moveUtils.js";

export async function generateBeginner2LookCFOP(scramble) {
  const cs = new CubeState(scramble);

  // Cross from minimal optimal prefix
  const crossMoves = solveWhiteCross(cs);

  // F2L placeholder (you can add later)
  const f2lMoves = "";

  // Last layer replacement
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
