// src/services/advancedCrossSolver.js
import {
  solveXCrossForScramble,
  solveXXCrossForScramble,
  solveXXXCrossForScramble,
} from "../vendor/cstimerCross.js";
import { CsTimerCubeState } from "../vendor/cstimerCubeState.js";

/**
 * Solve Extended Cross (XCross) for a scramble.
 * @param {string} scramble - scramble string
 * @param {number} face - face index (0 = D, 1 = U, etc.)
 */
export function solveXCross(scramble, face = 0) {
  console.log("=== Starting XCross Solver (csTimer module) ===");
  console.log("Scramble string:", scramble);

  const cs = new CsTimerCubeState(scramble);

  const xcrossMoves = solveXCrossForScramble(scramble, face);
  console.log("Raw solver output (XCross):", xcrossMoves);

  if (!xcrossMoves || xcrossMoves.length === 0) {
    console.warn("XCross solver returned empty solution.");
    return "";
  }

  cs.applySolution(xcrossMoves);

  console.log("Final XCross moves:", xcrossMoves);
  console.log("Cube after XCross:", cs.toFaceletString());

  return xcrossMoves;
}

/**
 * Solve Double Extended Cross (XXCross) for a scramble.
 * @param {string} scramble - scramble string
 * @param {number} face - face index
 */
export function solveXXCross(scramble, face = 0) {
  console.log("=== Starting XXCross Solver (csTimer module) ===");
  console.log("Scramble string:", scramble);

  const cs = new CsTimerCubeState(scramble);

  const xxcrossMoves = solveXXCrossForScramble(scramble, face);
  console.log("Raw solver output (XXCross):", xxcrossMoves);

  if (!xxcrossMoves || xxcrossMoves.length === 0) {
    console.warn("XXCross solver returned empty solution.");
    return "";
  }

  cs.applySolution(xxcrossMoves);

  console.log("Final XXCross moves:", xxcrossMoves);
  console.log("Cube after XXCross:", cs.toFaceletString());

  return xxcrossMoves;
}

/**
 * Solve Triple Extended Cross (XXXCross) for a scramble.
 * @param {string} scramble - scramble string
 * @param {number} face - face index
 */
export function solveXXXCross(scramble, face = 0) {
  console.log("=== Starting XXXCross Solver (csTimer module) ===");
  console.log("Scramble string:", scramble);

  const cs = new CsTimerCubeState(scramble);

  const xxxcrossMoves = solveXXXCrossForScramble(scramble, face);
  console.log("Raw solver output (XXXCross):", xxxcrossMoves);

  if (!xxxcrossMoves || xxxcrossMoves.length === 0) {
    console.warn("XXXCross solver returned empty solution.");
    return "";
  }

  cs.applySolution(xxxcrossMoves);

  console.log("Final XXXCross moves:", xxxcrossMoves);
  console.log("Cube after XXXCross:", cs.toFaceletString());

  return xxxcrossMoves;
}
