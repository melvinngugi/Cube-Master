// Provide a safe default rndFunc
if (typeof globalThis.rndFunc !== "function") {
  globalThis.rndFunc = function () {
    return Math.floor(Math.random() * 0x100000000);
  };
}

// Provide a stub isaac with seed/random
if (typeof globalThis.isaac === "undefined") {
  globalThis.isaac = {
    seed: function () {},
    random: function () {
      return Math.floor(Math.random() * 0x100000000);
    },
  };
}


// jQuery-like helpers
globalThis.$ = globalThis.$ || {
  isArray: Array.isArray,
  noop: function () {},
  map: (arr, fn) => arr.map(fn),
};

// Debug flag
if (typeof globalThis.DEBUG === "undefined") {
  globalThis.DEBUG = false;
}

// ISAAC RNG shim
if (typeof globalThis.isaac === "undefined") {
  globalThis.isaac = {
    seed: function () {},
    rand: function () {
      return Math.floor(Math.random() * 0x100000000);
    },
  };
}

// rndFunc shim
if (typeof globalThis.rndFunc !== "function") {
  globalThis.rndFunc = function () {
    return Math.floor(Math.random() * 0x100000000);
  };
}
