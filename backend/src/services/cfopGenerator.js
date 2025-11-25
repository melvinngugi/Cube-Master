import { getSolverSolution } from "./cubeState.js";
import { splitSolutionIntoPhases } from "./cfopHeuristics.js";
import { replaceLastLayerWithBeginner2Look } from "./lastLayer.js";
import { optimizeMoves, normalizeMoves } from "../utils/moveUtils.js";

/**
 * Full pipeline:
 * 1) Use solver to get a valid full solution (dynamic, no hardcoding).
 * 2) Heuristically split into Cross+F2L and LL.
 * 3) Replace LL with beginner 2-look OLL/PLL from DB.
 * 4) Return structured steps and optimized final string.
 */
export async function generateBeginner2LookCFOP(scramble) {
  // Step 1: solver-generated full solution
  const fullSolution = await getSolverSolution(scramble);

  // Step 2: segment phases (rough heuristic)
  const { crossF2L } = splitSolutionIntoPhases(fullSolution);

  // TODO: Build a cube state object if you’ll use it for case detection later
  const state = { scramble };

  // Step 3: replace LL
  const { llCombined, llSteps } = await replaceLastLayerWithBeginner2Look(state);

  // Step 4: merge, normalize, optimize
  const merged = normalizeMoves(`${crossF2L} ${llCombined}`.trim());
  const optimized = optimizeMoves(merged);

  const steps = [
    { label: "Cross + F2L", moves: crossF2L },
    ...llSteps,
  ];

  return {
    method: "CFOP",
    profile: "beginner-2look",
    steps,
    moves: optimized,
    meta: {
      replacedLL: true,
      source: "solver+heuristic",
    },
  };
}
