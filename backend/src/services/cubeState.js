import { createRequire } from "node:module";
import { normalizeMoves } from "../utils/moveUtils.js";

const require = createRequire(import.meta.url);
const Cube = require("cubejs");

// Initialize solver once
Cube.initSolver();

/**
 * Generate a valid full solution for a scramble using the Kociemba-based solver.
 * Returns a normalized move string (space-separated).
 */
export async function getSolverSolution(scramble) {
  const cube = new Cube();
  cube.move(normalizeMoves(scramble));
  const solution = cube.solve(); // e.g., "U R2 F' ..."

  return normalizeMoves(solution);
}

export function tokenize(seq) {
  return normalizeMoves(seq).split(" ");
}
