// backend/src/services/cubeModel.js
import { createRequire } from "node:module";
import { normalizeMoves } from "../utils/moveUtils.js";

const require = createRequire(import.meta.url);
const Cube = require("cubejs");

Cube.initSolver();

export class CubeState {
  constructor(scramble = "") {
    this.cube = new Cube();
    if (scramble) {
      if (scramble.length === 54) {
        this.cube = Cube.fromString(scramble);
      } else {
        this.apply(scramble);
      }
    }
  }

  apply(seq) {
    const s = normalizeMoves(seq);
    if (!s) return;
    this.cube.move(s);
  }

  toString() {
    return this.cube.asString();
  }

  solveKociemba() {
    return normalizeMoves(this.cube.solve());
  }

  getEdges() {
    const s = this.toString();
    const edgesMap = {
      UF: [1, 19],
      UR: [5, 10],
      UL: [3, 37],
      UB: [7, 46],
      DF: [28, 25],
      DR: [32, 14],
      DL: [30, 41],
      DB: [34, 50],
      FR: [23, 12],
      FL: [21, 39],
      BR: [52, 16],
      BL: [48, 43],
    };

    return Object.entries(edgesMap).map(([name, [i1, i2]]) => ({
      name,
      colors: [s[i1], s[i2]],
    }));
  }

  /** White edges are those containing "U" (Up face color = White) */
  getWhiteEdges() {
    return this.getEdges().filter(e => e.colors.includes("U"));
  }
}
