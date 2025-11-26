import "./shim.js";
import mathlib from "./mathlib.js";
import { parseScramble } from "./cubeutil.js";
import cross from "./cross.js";

/**
 * Returns the shortest CFOP cross solution for a given scramble string.
 * @param {string} scrambleStr - e.g. "R U R' U' F2 ..."
 * @returns {string} moves - e.g. "F R' U2 ..."
 */
export function solveCrossForScramble(scrambleStr) {
  if (!scrambleStr || typeof scrambleStr !== "string") return "";

  // Convert scramble string into csTimer’s internal move array
  const moves = parseScramble(scrambleStr, "FRUBLD");

  // Solve cross for all 6 orientations; cross.solve returns an array of arrays of move tokens (strings)
  const solutions = cross.solve(moves);
  if (!solutions || solutions.length === 0) {
    return "";
  }

  // Pick the shortest solution (fewest moves)
  const best = solutions.reduce((a, b) => (a.length <= b.length ? a : b));

  // Join into a single space-delimited string
  return best.join(" ").trim();
}
