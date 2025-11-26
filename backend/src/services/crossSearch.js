// backend/src/services/crossSearch.js
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const Cube = require("cubejs");

// Preferred move order for cross building
const ORDER = [
  "U", "U'", "U2",
  "D", "D'", "D2",
  "F2", "R2", "L2", "B2",
  "F", "F'", "R", "R'", "L", "L'", "B", "B'",
];

// D-face cross edges indices: DF, DR, DL, DB
const D_EDGES = {
  DF: [28, 25],
  DR: [32, 14],
  DL: [30, 41],
  DB: [34, 50],
};

// Centers base indices
const BASE = { U: 0, R: 9, F: 18, D: 27, L: 36, B: 45 };

function centersFromString(s) {
  return {
    U: s[BASE.U + 4],
    R: s[BASE.R + 4],
    F: s[BASE.F + 4],
    D: s[BASE.D + 4],
    L: s[BASE.L + 4],
    B: s[BASE.B + 4],
  };
}

function countSolvedCrossEdges(s) {
  const C = centersFromString(s);
  let count = 0;
  if (s[D_EDGES.DF[0]] === C.U && s[D_EDGES.DF[1]] === C.F) count++;
  if (s[D_EDGES.DR[0]] === C.U && s[D_EDGES.DR[1]] === C.R) count++;
  if (s[D_EDGES.DL[0]] === C.U && s[D_EDGES.DL[1]] === C.L) count++;
  if (s[D_EDGES.DB[0]] === C.U && s[D_EDGES.DB[1]] === C.B) count++;
  return count;
}

export function isCrossSolvedString(s) {
  return countSolvedCrossEdges(s) === 4;
}

function whiteOnDEdges(s) {
  const DedgeIndices = [28, 30, 32, 34];
  return DedgeIndices.reduce((acc, i) => acc + (s[i] === "U" ? 1 : 0), 0);
}

function scoreCrossState(s) {
  return countSolvedCrossEdges(s) * 10 + whiteOnDEdges(s);
}

function invertMove(m) {
  if (m.endsWith("2")) return m;
  if (m.endsWith("'")) return m.slice(0, -1);
  return m + "'";
}

function isRedundant(seq, move) {
  if (seq.length === 0) return false;
  const last = seq[seq.length - 1];
  const face = move[0];
  const lastFace = last[0];

  // Immediate inverse
  if (last === invertMove(move)) return true;

  // Triple churn on same face
  const recent = seq.slice(-2);
  if (recent.length === 2 && recent.every(m => m[0] === face)) return true;

  return false;
}

function applyMovesToClone(cubeString, moves) {
  const c = Cube.fromString(cubeString);
  if (moves.length) c.move(moves.join(" "));
  return c.asString();
}

/**
 * Iterative deepening with optional time budget.
 * Provide a facelet string and search within maxDepth (and timeBudgetMs if set).
 */
export function searchCrossFromFacelet(startFacelet, maxDepth = 8, timeBudgetMs = 1500) {
  const t0 = Date.now();
  if (isCrossSolvedString(startFacelet)) return [];

  for (let depth = 1; depth <= maxDepth; depth++) {
    const ctx = {
      t0,
      timeBudgetMs,
      nodeCap: 20000,
      bestScore: scoreCrossState(startFacelet),
      expanded: 0,
    };

    const res = dfsWithLimits(startFacelet, [], depth, ctx);
    console.log(`[CrossSearch] depth=${depth} expanded=${res?.expanded ?? 0} bestScore=${res?.bestScore ?? "n/a"}`);
    if (res?.seq) return res.seq;
    if (timeBudgetMs && Date.now() - t0 > timeBudgetMs) {
      console.warn("[CrossSearch] Time budget exceeded.");
      break;
    }
  }

  return null;
}

function dfsWithLimits(facelet, seq, depth, ctx) {
  if (ctx.timeBudgetMs && Date.now() - ctx.t0 > ctx.timeBudgetMs) return null;
  if (ctx.expanded++ > ctx.nodeCap) return null;

  const currentScore = scoreCrossState(facelet);
  if (currentScore > ctx.bestScore) ctx.bestScore = currentScore;

  if (isCrossSolvedString(facelet)) return { seq, expanded: ctx.expanded, bestScore: ctx.bestScore };
  if (depth === 0) return null;

  for (const m of ORDER) {
    if (isRedundant(seq, m)) continue;

    const nextFacelet = applyMovesToClone(facelet, [m]);
    const nextScore = scoreCrossState(nextFacelet);

    // Light pruning to avoid deep regressions; allow small dips
    if (nextScore < currentScore - 3) continue;

    const nextSeq = [...seq, m];
    const found = dfsWithLimits(nextFacelet, nextSeq, depth - 1, ctx);
    if (found?.seq) return found;
  }

  return null;
}
