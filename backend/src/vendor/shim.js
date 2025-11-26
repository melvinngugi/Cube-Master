// backend/src/vendor/shim.js

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
    seed: function () {}, // no-op
    random: function () {
      return Math.floor(Math.random() * 0x100000000);
    },
  };
}

// rndFunc shim
if (typeof globalThis.rndFunc !== "function") {
  // Default to isaac.random if available, else Math.random
  globalThis.rndFunc = function () {
    return (globalThis.isaac && typeof globalThis.isaac.random === "function")
      ? globalThis.isaac.random()
      : Math.floor(Math.random() * 0x100000000);
  };
}

// csTimer UI flag shim
if (typeof globalThis.ISCSTIMER === "undefined") {
  globalThis.ISCSTIMER = false;
}