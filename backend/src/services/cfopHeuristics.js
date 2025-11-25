import { tokenize } from "./cubeState.js";

/**
 * Heuristically segment a solver solution string into:
 * - Cross + F2L (first part)
 * - Last Layer (last ~12–16 moves)
 *
 * This is pragmatic and gets you dynamic results quickly.
 * You can refine it (pattern checks for U/M moves, OLL/PLL signatures) later.
 */
export function splitSolutionIntoPhases(solutionSeq) {
  const moves = tokenize(solutionSeq);

  // Tune based on your observations (12–16 typical range)
  const LL_RANGE_LENGTH = 14;

  const llStartIndex = Math.max(0, moves.length - LL_RANGE_LENGTH);
  const crossF2L = moves.slice(0, llStartIndex).join(" ");
  const lastLayer = moves.slice(llStartIndex).join(" ");

  return {
    crossF2L,
    lastLayer,
    indices: { llStartIndex, total: moves.length },
  };
}
