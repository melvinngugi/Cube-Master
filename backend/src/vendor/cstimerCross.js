// backend/src/vendor/cstimerCross.js
import "./shim.js";
import mathlib from "./mathlib.js";
import { parseScramble } from "./cubeutil.js";
import cross from "./cross.js";

/**
 * Returns the CFOP cross solution for a given scramble string.
 * faceIndex selects orientation: 0 = D, 1 = U, 2 = L, 3 = R, 4 = F, 5 = B.
 */
export function solveCrossForScramble(scrambleStr, faceIndex = 0) {
  if (!scrambleStr || typeof scrambleStr !== "string") return "";

  const moves = parseScramble(scrambleStr, "FRUBLD");
  const solutions = cross.solve(moves);
  if (!solutions || solutions.length === 0) return "";

  const chosen = solutions[faceIndex];
  return Array.isArray(chosen) ? chosen.join(" ").trim() : "";
}

/**
 * Returns an Extended Cross (XCross) solution for a scramble.
 */
export function solveXCrossForScramble(scrambleStr, faceIndex = 0) {
  if (!scrambleStr || typeof scrambleStr !== "string") return "";

  const moves = parseScramble(scrambleStr, "FRUBLD");
  const solution = cross.solveXCross(moves, faceIndex);
  if (!solution || solution.length === 0) return "";

  return Array.isArray(solution) ? solution.join(" ").trim() : "";
}

/**
 * Returns a Double Extended Cross (XXCross) solution for a scramble.
 */
export function solveXXCrossForScramble(scrambleStr, faceIndex = 0) {
  if (!scrambleStr || typeof scrambleStr !== "string") return "";

  const moves = parseScramble(scrambleStr, "FRUBLD");
  const solution = cross.solveXXCross(moves, faceIndex);
  if (!solution || solution.length === 0) return "";

  return Array.isArray(solution) ? solution.join(" ").trim() : "";
}

/**
 * Returns a Triple Extended Cross (XXXCross) solution for a scramble.
 */
export function solveXXXCrossForScramble(scrambleStr, faceIndex = 0) {
  if (!scrambleStr || typeof scrambleStr !== "string") return "";

  const moves = parseScramble(scrambleStr, "FRUBLD");
  const solution = cross.solveXXXCross(moves, faceIndex);
  if (!solution || solution.length === 0) return "";

  return Array.isArray(solution) ? solution.join(" ").trim() : "";
}

export default {
  solveCrossForScramble,
  solveXCrossForScramble,
  solveXXCrossForScramble,
  solveXXXCrossForScramble,
};
