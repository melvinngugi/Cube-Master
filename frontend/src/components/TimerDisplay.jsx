export default function TimerDisplay({ time, solves, armed, ready, running, focusMode }) {
  const format = (ms) => {
    const sec = Math.floor(ms / 1000);
    const dec = Math.floor((ms % 1000) / 10);
    return `${sec}.${dec.toString().padStart(2, "0")}`;
  };

  const ao5 = solves.slice(0, 5);
  const ao12 = solves.slice(0, 12);
  const avg = (arr) =>
    arr.length === 0 ? "00.00" : format(arr.reduce((a, b) => a + b, 0) / arr.length);

  const formattedTime = format(time);
  const [main, decimal] = formattedTime.split(".");

  let color = "text-black font-bold";
  if (armed && !ready) color = "text-red-600 font-bold";
  else if (ready && !running) color = "text-green-600 font-bold";
  else if (running) color = "text-green-600 font-bold";

  return (
    <div className="flex flex-col items-center justify-center" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      <div className={`flex items-baseline mb-6 ${color}`}>
        <span className="text-[18rem] font-bold leading-none">{main}</span>
        <span className="text-[10rem] font-bold leading-none">.{decimal}</span>
      </div>
      {!focusMode && (
        <>
          <div className="text-[3rem] text-black">ao5: {avg(ao5)}</div>
          <div className="text-[3rem] text-black">ao12: {avg(ao12)}</div>
        </>
      )}
    </div>
  );
}