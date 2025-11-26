import { solveCrossForScramble } from "../vendor/cstimerCross.js";
import { normalizeMoves, optimizeMoves } from "../utils/moveUtils.js";

/**
 * Generate and apply CFOP cross moves using csTimer’s solver module.
 * @param {string} scramble - move string (e.g. "R U R' U'")
 * @param {CubeState} cubeState - shared cube state to apply moves to
 * @returns {string} crossMoves
 */
export function solveWhiteCross(scramble, cubeState) {
  console.log("=== Starting Cross Solver (csTimer module) ===");
  console.log("Scramble string:", scramble);

  const crossRaw = solveCrossForScramble(scramble);
  const crossMoves = optimizeMoves(normalizeMoves(crossRaw));

  if (!crossMoves) {
    console.warn("Cross solver returned empty. No cross moves applied.");
    return "";
  }

  cubeState.apply(crossMoves);
  console.log("Final cross moves:", crossMoves);
  return crossMoves;
}
