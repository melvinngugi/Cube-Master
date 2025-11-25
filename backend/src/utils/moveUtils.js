export function normalizeMoves(seq) {
  return seq
    .trim()
    .replace(/\s+/g, " ")
    .replace(/“|”/g, "'")
    .replace(/’/g, "'");
}

/**
 * Very basic optimizer:
 * - Cancels immediate inverses (U U' → remove)
 * - Merges same-face moves (R R → R2, R' R' → R2, R2 R2 → remove)
 * This is deliberately simple; expand later (rotation cleanup, STM-aware).
 */
export function optimizeMoves(seq) {
  const tokens = normalizeMoves(seq).split(" ");
  const out = [];

  const face = (m) => m[0]; // e.g., 'R', 'U', 'F', 'M'
  const val = (m) => (m.includes("2") ? 2 : m.endsWith("'") ? -1 : 1);
  const inv = (m) => (m.includes("2") ? m : m.endsWith("'") ? m.slice(0, -1) : m + "'");

  for (const m of tokens) {
    if (!m) continue;
    if (out.length === 0) {
      out.push(m);
      continue;
    }
    const last = out[out.length - 1];

    // Cancel exact inverse
    if (inv(m) === last) {
      out.pop();
      continue;
    }

    // Merge same face moves
    if (face(last) === face(m)) {
      const s = val(last) + val(m);
      if (s === 0) {
        out.pop();
        continue;
      }
      const dir = s === 2 || s === -2 ? "2" : s === 1 ? "" : "'";
      out[out.length - 1] = face(m) + dir;
      continue;
    }

    out.push(m);
  }

  return out.join(" ");
}
