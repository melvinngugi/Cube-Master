// backend/src/utils/moveUtils.js
export function normalizeMoves(seq) {
  if (!seq) return "";
  if (Array.isArray(seq)) {
    return seq.join(" ").trim().replace(/\s+/g, " ");
  }
  if (typeof seq === "string") {
    return seq.trim().replace(/\s+/g, " ");
  }
  return "";
}

export function optimizeMoves(seq) {
  const s = normalizeMoves(seq);
  if (!s) return "";

  const tokens = s.split(" ");
  const out = [];

  const invert = m => (m.endsWith("2") ? m : m.endsWith("'") ? m.slice(0, -1) : m + "'");

  for (const m of tokens) {
    const last = out[out.length - 1];
    if (!last) {
      out.push(m);
      continue;
    }

    // Cancel immediate inverses
    if (invert(m) === last) {
      out.pop();
      continue;
    }

    // Same-face combinations
    if (last[0] === m[0]) {
      const face = m[0];
      const a = last.endsWith("'") ? -1 : last.endsWith("2") ? 2 : 1;
      const b = m.endsWith("'") ? -1 : m.endsWith("2") ? 2 : 1;
      const sum = a + b;

      if (sum === 0) {
        out.pop(); // e.g., R + R' => cancel
        continue;
      }
      if (sum === 2) {
        out.pop();
        out.push(`${face}2`);
        continue;
      }
      if (sum === -2) {
        out.pop();
        out.push(`${face}2`);
        continue;
      }
      if (sum === 3) { // R + R2 => R'
        out.pop();
        out.push(`${face}'`);
        continue;
      }
      if (sum === -3) { // R' + R2 => R
        out.pop();
        out.push(face);
        continue;
      }
    }

    out.push(m);
  }

  return out.join(" ");
}
