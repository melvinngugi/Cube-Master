// backend/src/utils/moveUtils.js
const validFaces = new Set(["U", "D", "L", "R", "F", "B"]);
const suffixes = ["", "'", "2"];

export function normalizeMoves(seq) {
  return (seq || "")
    .trim()
    .replace(/\s+/g, " ");
}

export function filterValidMoves(seq) {
  const tokens = normalizeMoves(seq).split(" ").filter(Boolean);
  return tokens.filter(t => {
    const f = t[0];
    const suf = t.slice(1);
    return validFaces.has(f) && suffixes.includes(suf);
  }).join(" ");
}

/**
 * Basic optimizer:
 * - Cancel immediate inverses
 * - Merge same-face moves
 */
export function optimizeMoves(seq) {
  const tokens = normalizeMoves(seq).split(" ").filter(Boolean);
  const out = [];

  const face = (m) => m[0];
  const val = (m) => (m.includes("2") ? 2 : m.endsWith("'") ? -1 : 1);
  const inv = (m) => (m.includes("2") ? m : m.endsWith("'") ? m.slice(0, -1) : m + "'");

  for (const m of tokens) {
    if (!m) continue;
    if (out.length === 0) {
      out.push(m);
      continue;
    }
    const last = out[out.length - 1];

    if (inv(m) === last) {
      out.pop();
      continue;
    }

    if (face(last) === face(m)) {
      const s = val(last) + val(m);
      if (s === 0) {
        out.pop();
        continue;
      }
      const dir = Math.abs(s) === 2 ? "2" : s === 1 ? "" : "'";
      out[out.length - 1] = face(m) + dir;
      continue;
    }

    out.push(m);
  }

  return out.join(" ");
}
