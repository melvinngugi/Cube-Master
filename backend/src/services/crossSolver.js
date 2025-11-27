// backend/src/services/crossSolver.js

import { solveCrossForScramble } from "../vendor/cstimerCross.js";
import { CsTimerCubeState } from "../vendor/cstimerCubeState.js";
import { isWhiteCrossSolved } from "../vendor/validateCross.js";
import mathlib from "../vendor/mathlib.js";

export function solveWhiteCross(scramble) {
  console.log("=== Starting Cross Solver (csTimer module) ===");
  console.log("Scramble string:", scramble);

  // Apply scramble to cube state
  const cs = new CsTimerCubeState(scramble);

  // Ask solver for the D-face cross (yellow in csTimer’s orientation)
  let crossMoves = solveCrossForScramble(scramble, 0);
  console.log("Raw solver output (D-face cross):", crossMoves);

  if (!crossMoves) {
    console.warn("Cross solver returned empty solution.");
    return "";
  }

  // Apply the solver’s moves
  cs.applySolution(crossMoves);

  // Now rotate cube state: x2 (two X rotations) to put white cross on D
  const d = new mathlib.CubieCube();
  mathlib.CubieCube.CubeMult(cs.cube, mathlib.CubieCube.rotCube[0], d);
  cs.cube.init(d.ca, d.ea);
  mathlib.CubieCube.CubeMult(cs.cube, mathlib.CubieCube.rotCube[0], d);
  cs.cube.init(d.ca, d.ea);

  // Adjust solution string to include the orientation rotation at the end
  crossMoves = crossMoves + " x2";

  console.log("Final cross moves (with orientation):", crossMoves);
  console.log("Cube after cross:", cs.toFaceletString());

  // Validate white cross
  const ok = isWhiteCrossSolved(cs.cube);
  if (!ok) {
    console.error("Cross validation failed (white cross not aligned).");
  } else {
    console.log("White cross validated successfully.");
  }

  return crossMoves;
}
