// backend/src/utils/moveUtils.js

// Normalize a move sequence into a single space-delimited string.
// Accepts strings or arrays of tokens.
export function normalizeMoves(seq) {
  if (!seq) return "";
  if (Array.isArray(seq)) {
    return seq.join(" ").trim().replace(/\s+/g, " ");
  }
  if (typeof seq === "string") {
    return seq.trim().replace(/\s+/g, " ");
  }
  // Fallback for unexpected inputs (e.g., object)
  return "";
}

// Very lightweight optimizer: cancel immediate inverses and collapse obvious patterns.
// This is intentionally simple; for deeper optimization integrate a move reducer later.
export function optimizeMoves(seq) {
  const s = normalizeMoves(seq);
  if (!s) return "";

  const tokens = s.split(" ");
  const out = [];

  const invert = m => {
    if (m.endsWith("2")) return m;
    return m.endsWith("'") ? m.slice(0, -1) : m + "'";
  };

  for (const m of tokens) {
    const last = out[out.length - 1];
    if (!last) {
      out.push(m);
      continue;
    }

    // Cancel immediate inverse moves (e.g., U U')
    if (invert(m) === last) {
      out.pop();
      continue;
    }

    // Combine triple same face: X X X -> X'
    // Combine double same face: X X -> X2
    if (last[0] === m[0]) {
      // Same face
      if (last.endsWith("2") && m.endsWith("2")) {
        // X2 X2 -> empty (full rotation)
        out.pop();
        continue;
      }
      if (!last.endsWith("'") && !last.endsWith("2") && !m.endsWith("'") && !m.endsWith("2")) {
        // X X -> X2
        out.pop();
        out.push(`${m[0]}2`);
        continue;
      }
      if (last.endsWith("'") && m.endsWith("'")) {
        // X' X' -> X2
        out.pop();
        out.push(`${m[0]}2`);
        continue;
      }
      // X2 followed by X -> X' (approximate)
      if (last.endsWith("2") && !m.endsWith("'") && !m.endsWith("2")) {
        out.pop();
        out.push(`${m[0]}'`);
        continue;
      }
      // X2 followed by X' -> X (approximate)
      if (last.endsWith("2") && m.endsWith("'")) {
        out.pop();
        out.push(`${m[0]}`);
        continue;
      }
    }

    out.push(m);
  }

  return out.join(" ");
}
