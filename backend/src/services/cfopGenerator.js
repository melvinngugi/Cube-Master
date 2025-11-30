// backend/src/services/cfopGenerator.js
import { CubeState } from "./cubeModel.js";
import { solveCross } from "./crossSolver.js";
import { solveXCross, solveXXCross, solveXXXCross } from "./advancedCrossSolver.js";
import { normalizeMoves, optimizeMoves } from "../utils/moveUtils.js";

/**
 * Beginner CFOP (2-Look) generator
 */
export async function generateBeginner2LookCFOP(scramble) {
  const cs = new CubeState(scramble);

  const crossMoves = solveCross(scramble);
  const steps = [{ label: "Cross", moves: crossMoves }];

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

/**
 * Advanced CFOP with Extended Cross (XCross)
 */
export async function generateXCrossCFOP(scramble) {
  const cs = new CubeState(scramble);

  const xcrossMoves = solveXCross(scramble);
  const steps = [{ label: "XCross", moves: xcrossMoves }];

  const normalized = normalizeMoves(xcrossMoves);
  const optimized = optimizeMoves(normalized);

  return {
    method: "CFOP",
    profile: "xcross",
    steps,
    moves: optimized,
    meta: { source: "cfop-cstimer-xcross" },
  };
}

/**
 * Advanced CFOP with Double Extended Cross (XXCross)
 */
export async function generateXXCrossCFOP(scramble) {
  const cs = new CubeState(scramble);

  const xxcrossMoves = solveXXCross(scramble);
  const steps = [{ label: "XXCross", moves: xxcrossMoves }];

  const normalized = normalizeMoves(xxcrossMoves);
  const optimized = optimizeMoves(normalized);

  return {
    method: "CFOP",
    profile: "xxcross",
    steps,
    moves: optimized,
    meta: { source: "cfop-cstimer-xxcross" },
  };
}

/**
 * Advanced CFOP with Triple Extended Cross (XXXCross)
 */
export async function generateXXXCrossCFOP(scramble) {
  const cs = new CubeState(scramble);

  const xxxcrossMoves = solveXXXCross(scramble);
  const steps = [{ label: "XXXCross", moves: xxxcrossMoves }];

  const normalized = normalizeMoves(xxxcrossMoves);
  const optimized = optimizeMoves(normalized);

  return {
    method: "CFOP",
    profile: "xxxcross",
    steps,
    moves: optimized,
    meta: { source: "cfop-cstimer-xxxcross" },
  };
}
