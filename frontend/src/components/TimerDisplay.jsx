export default function TimerDisplay() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      <div className="flex items-baseline mb-6">
        <span className="text-[18rem] font-bold text-black leading-none">00</span>
        <span className="text-[10rem] font-bold text-black leading-none">.00</span>
      </div>
      <div className="text-[3rem] text-black">ao5: 28.12</div>
      <div className="text-[3rem] text-black">ao12: 30.01</div>
    </div>
  );
}