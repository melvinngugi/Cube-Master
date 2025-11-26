import { solveCrossForScramble } from "../vendor/cstimerCross.js";
import { CsTimerCubeState } from "../vendor/cstimerCubeState.js";
import { orientWhiteDownGreenFront } from "../vendor/orientCube.js";
import { isWhiteCrossSolved } from "../vendor/validateCross.js";

export function solveWhiteCross(scramble) {
  console.log("=== Starting Cross Solver (csTimer module) ===");
  console.log("Scramble string:", scramble);

  const cs = new CsTimerCubeState(scramble);

  try {
    // Force the standard CFOP orientation
    orientWhiteDownGreenFront(cs.cube);

    // Solve cross for D face (white down)
    const crossMoves = solveCrossForScramble(scramble, 0);
    console.log("Raw solver output:", crossMoves);

    if (!crossMoves) {
      console.warn("Cross solver returned empty solution.");
      return "";
    }

    cs.applySolution(crossMoves);

    console.log("Final cross moves:", crossMoves);
    console.log("Cube after cross:", cs.toFaceletString());

    const ok = isWhiteCrossSolved(cs.cube);
    if (!ok) {
      console.error("Cross validation failed (white cross not aligned).");
    } else {
      console.log("White cross validated successfully.");
    }

    return crossMoves;
  } catch (err) {
    console.error("Solver threw an error:", err);
    return "";
  }
}
