import "./shim.js";
import mathlib from "./mathlib.js";
import { parseScramble } from "./cubeutil.js";


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
      const moveIdx = axis * 3 + (pow - 1);
      mathlib.CubieCube.CubeMult(this.cube, mathlib.CubieCube.moveCube[moveIdx], d);
      this.cube.init(d.ca, d.ea);
    }
  }

  applySolution(solutionMovesStr) {
    if (!solutionMovesStr) return;
    const d = new mathlib.CubieCube();
    const tokens = solutionMovesStr.split(" ").filter(Boolean);
    for (const token of tokens) {
      const idx = this.cube.selfMoveStr(token);
      mathlib.CubieCube.CubeMult(this.cube, mathlib.CubieCube.moveCube[idx], d);
      this.cube.init(d.ca, d.ea);
    }
  }

  toFaceletString() {
    return this.cube.toFaceCube();
  }
}
