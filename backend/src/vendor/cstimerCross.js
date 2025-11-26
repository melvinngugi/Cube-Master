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

export default solveCrossForScramble;
