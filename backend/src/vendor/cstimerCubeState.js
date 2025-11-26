import "./shim.js";
import mathlib from "./mathlib.js";
import { parseScramble } from "./cubeutil.js";

/**
 * Cube state using csTimer's CubieCube representation.
 */
export class CsTimerCubeState {
  constructor(scrambleStr = "") {
    this.cube = new mathlib.CubieCube();
    if (scrambleStr) {
      this.applyScramble(scrambleStr);
    }
  }

  applyScramble(scrambleStr) {
    const moves = parseScramble(scrambleStr, "FRUBLD");
    const d = new mathlib.CubieCube();
    for (const m of moves) {
      const axis = m[0];
      const pow = m[2];
      const moveIdx = axis * 3 + pow - 1;
      mathlib.CubieCube.CubeMult(this.cube, mathlib.CubieCube.moveCube[moveIdx], d);
      this.cube.init(d.ca, d.ea);
    }
  }

  applySolution(solutionMoves) {
    const d = new mathlib.CubieCube();
    for (const move of solutionMoves.split(" ")) {
      if (!move) continue;
      const m = this.cube.selfMoveStr(move);
      mathlib.CubieCube.CubeMult(this.cube, mathlib.CubieCube.moveCube[m], d);
      this.cube.init(d.ca, d.ea);
    }
  }

  toFaceletString() {
    return this.cube.toFaceCube();
  }
}
