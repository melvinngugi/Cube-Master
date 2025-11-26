// backend/src/services/crossSolver.js
import { normalizeMoves, optimizeMoves } from "../utils/moveUtils.js";

/**
 * Solve the white cross on D using beginner CFOP logic.
 * Handles different orientations of white edges.
 */
export function solveWhiteCross(cubeState) {
  console.log("=== Starting Cross Solver (CFOP Cross) ===");
  console.log("Scramble state:", cubeState.toString());

  const seq = [];

  // Repeat until all four white edges are solved
  for (let i = 0; i < 30; i++) {
    const edges = cubeState.getWhiteEdges();
    const unsolved = edges.filter(e => !isCrossSolved(cubeState, e));
    if (unsolved.length === 0) {
      console.log("White cross solved, breaking loop.");
      break;
    }

    const edge = unsolved[0];
    console.log("Working on edge:", edge);

    const moveSeq = solveEdge(cubeState, edge);
    if (moveSeq) {
      cubeState.apply(moveSeq);
      seq.push(moveSeq);
    }
  }

  const out = optimizeMoves(normalizeMoves(seq.join(" ")));
  console.log("Final cross moves:", out);
  return out;
}

/**
 * Choose algorithm based on orientation of the white sticker.
 */
function solveEdge(cubeState, edge) {
  const s = cubeState.toString();
  const partner = edge.colors.find(c => c !== "U");

  // Case A: white sticker on U face
  if (edge.name.startsWith("U")) {
    return alignAndFlipDown(cubeState, partner);
  }

  // Case B: white sticker on side face (middle layer)
  if (["FR","FL","BR","BL"].includes(edge.name)) {
    return "F U F'"; // lift to U, then handle as Case A next loop
  }

  // Case C: white sticker on D face but misaligned
  if (edge.name.startsWith("D")) {
    return "D"; // rotate D until aligned
  }

  return "";
}

/**
 * Rotate U until partner matches its center, then flip down with 180° turn.
 */
function alignAndFlipDown(cubeState, partnerColor) {
  const seq = [];

  // Rotate U until partner matches its center
  for (let j = 0; j < 4; j++) {
    if (isAboveCenter(cubeState, partnerColor)) break;
    cubeState.apply("U");
    seq.push("U");
  }

  // Flip down
  const face = faceForColor(cubeState, partnerColor);
  if (face) {
    seq.push(face + "2");
  }

  return seq.join(" ");
}

/**
 * Map partner color to its face letter.
 */
function faceForColor(cubeState, color) {
  const centers = getCenters(cubeState);
  for (const [face, c] of Object.entries(centers)) {
    if (c === color) return face;
  }
  return null;
}

function getCenters(cubeState) {
  const s = cubeState.toString();
  const base = { U: 0, R: 9, F: 18, D: 27, L: 36, B: 45 };
  return {
    U: s[base.U + 4],
    R: s[base.R + 4],
    F: s[base.F + 4],
    D: s[base.D + 4],
    L: s[base.L + 4],
    B: s[base.B + 4],
  };
}

/**
 * Check if edge is solved in the cross.
 */
function isCrossSolved(cubeState, edge) {
  const s = cubeState.toString();
  const base = { D: 27, R: 9, F: 18, L: 36, B: 45 };

  if (edge.colors.includes("U") && edge.name.startsWith("D")) {
    const other = edge.colors.find(c => c !== "U");
    const face = edge.name[1]; // DF -> F, DR -> R, etc.
    const centers = getCenters(cubeState);
    const center = centers[face];
    return other === center;
  }
  return false;
}

/**
 * Check if partner color is above its center on U face.
 */
function isAboveCenter(cubeState, color) {
  const centers = getCenters(cubeState);
  return Object.values(centers).includes(color);
}
