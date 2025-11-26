/**
 * Validate that the white cross is solved on the D face and aligned.
 * Returns true if D edges are "U" and their adjacent stickers match F/R/B/L centers.
 */
export function isWhiteCrossSolved(cube) {
  const f = cube.toFaceCube();

  // D face edge positions in facelet string
  const dEdges = [28, 30, 32, 34]; // D face edges
  const downStickers = dEdges.map(i => f[i]);
  if (!downStickers.every(s => s === "U")) return false;

  // Adjacent stickers around the sides corresponding to those edges
  // Mapping: F edge sticker (19), R edge sticker (16), B edge sticker (46), L edge sticker (43)
  const adj = [f[19], f[16], f[46], f[43]];

  // Centers for sides
  const centers = {
    F: f[22],
    R: f[13],
    B: f[49],
    L: f[40],
  };
  const expected = [centers.F, centers.R, centers.B, centers.L];

  return adj.every((s, i) => s === expected[i]);
}
