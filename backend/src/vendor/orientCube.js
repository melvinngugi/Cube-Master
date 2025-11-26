import mathlib from "./mathlib.js";

/**
 * Rotate cube so white is on D and green is on F.
 * Uses csTimer's rotCube tables: 0 = X, 1 = Y, 2 = Z rotations.
 */
export function orientWhiteDownGreenFront(cube) {
  const centers = () => {
    const f = cube.toFaceCube();
    return {
      U: f[4],   // Up center
      R: f[13],  // Right center
      F: f[22],  // Front center
      D: f[31],  // Down center
      L: f[40],  // Left center
      B: f[49],  // Back center
    };
  };

  let c = centers();

  // Rotate around X until white ("U") is on D
  // csTimer color letters: U (white), R (red), F (green), D (yellow), L (orange), B (blue)
  let safety = 0;
  while (c.D !== "U" && safety++ < 12) {
    const d = new mathlib.CubieCube();
    mathlib.CubieCube.CubeMult(cube, mathlib.CubieCube.rotCube[0], d); // X rotation
    cube.init(d.ca, d.ea);
    c = centers();
  }

  // Rotate around Y until green ("F") is on Front
  safety = 0;
  while (c.F !== "F" && safety++ < 12) {
    const d = new mathlib.CubieCube();
    mathlib.CubieCube.CubeMult(cube, mathlib.CubieCube.rotCube[1], d); // Y rotation
    cube.init(d.ca, d.ea);
    c = centers();
  }
}
