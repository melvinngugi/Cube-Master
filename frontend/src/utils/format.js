export const formatMsToSecDeci = (ms) => {
  const sec = Math.floor(ms / 1000);
  const dec = Math.floor((ms % 1000) / 10);
  return `${sec}.${dec.toString().padStart(2, "0")}`;
};
