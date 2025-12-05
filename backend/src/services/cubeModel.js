import { createRequire } from "node:module";
import { normalizeMoves } from "../utils/moveUtils.js";

const require = createRequire(import.meta.url);
const Cube = require("cubejs");
Cube.initSolver();

export class CubeState {
  constructor(scramble = "") {
    this.cube = new Cube();
    if (scramble) {
      if (typeof scramble === "string" && scramble.length === 54) {
        this.cube = Cube.fromString(scramble);
      } else if (typeof scramble === "string") {
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
}
