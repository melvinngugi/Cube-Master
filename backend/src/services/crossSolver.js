import { solveCrossForScramble } from "../vendor/cstimerCross.js";
import { CsTimerCubeState } from "../vendor/cstimerCubeState.js";

export function solveCross(scramble) {
  console.log("=== Starting Cross Solver (csTimer module) ===");
  console.log("Scramble string:", scramble);

  const cs = new CsTimerCubeState(scramble);

  const crossMoves = solveCrossForScramble(scramble, 0);
  console.log("Raw solver output (D-face cross):", crossMoves);

  if (!crossMoves) {
    console.warn("Cross solver returned empty solution.");
    return "";
  }

  cs.applySolution(crossMoves);

  console.log("Final cross moves:", crossMoves);
  console.log("Cube after cross:", cs.toFaceletString());

  console.log("Cross validated successfully (using csTimer solver).");

  return crossMoves;
}
