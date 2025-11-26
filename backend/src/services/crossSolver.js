// backend/src/services/crossSolver.js
import { createRequire } from "node:module";
import { normalizeMoves, optimizeMoves } from "../utils/moveUtils.js";
import { searchCrossFromFacelet, isCrossSolvedString } from "./crossSearch.js";

const require = createRequire(import.meta.url);
const Cube = require("cubejs");

/**
 * Solve the white cross using search from the scrambled cube.
 * Accepts the scramble (move string) and a shared CubeState to apply results to.
 */
export function solveWhiteCross(scramble, cubeState) {
  console.log("=== Starting Cross Solver (Search CFOP Cross) ===");
  console.log("Scramble string:", scramble);

  // Build start facelet from scramble moves using cubejs
  const c = new Cube();
  const applied = normalizeMoves(scramble);
  if (applied) c.move(applied);
  const startFacelet = c.asString();

  if (isCrossSolvedString(startFacelet)) {
    console.log("Cross already solved at start.");
    return "";
  }

  // Run search
  const timeBudgetMs = 2000; // adjust if needed
  const maxDepth = 9;
  const seq = searchCrossFromFacelet(startFacelet, maxDepth, timeBudgetMs);

  // Fallback if search fails
  if (!seq || seq.length === 0) {
    console.warn("Cross search failed or timed out. Applying safe fallback.");
    const fallback = fallbackDaisyDown();
    cubeState.apply(fallback);
    console.log("Fallback cross moves:", fallback);
    return optimizeMoves(normalizeMoves(fallback));
  }

  const moves = optimizeMoves(normalizeMoves(seq.join(" ")));
  cubeState.apply(moves);
  console.log("Final cross moves:", moves);
  return moves;
}

function fallbackDaisyDown() {
  // Beginner-friendly fallback to try to form a cross by flipping faces down
  const seq = [
    "U", "F2", "U", "R2", "U", "B2", "U", "L2",
    "D", "F2", "D'", "R2", "U2", "B2", "L2",
  ];
  return seq.join(" ");
}
