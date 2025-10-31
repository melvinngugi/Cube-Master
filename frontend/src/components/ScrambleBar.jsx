import { useEffect } from "react";

export default function ScrambleBar({ scramble, setScramble, eventId }) {
  useEffect(() => {
    window.getWcaScramble(eventId).then(setScramble);
  }, [eventId]);

  return (
    <div className="bg-[#6D7276] text-white px-6 py-6 sm:px-4 sm:py-3 w-full absolute top-0 z-10">
      <div className="flex justify-between items-center mb-4 sm:mb-2">
        <select
          className="bg-[#B4B6B9] text-black px-2 py-1 rounded text-sm sm:text-xs"
          value={eventId}
          onChange={(e) => setScramble("")}
        >
          <option value="333">3×3×3</option>
          <option value="222">2×2×2</option>
          <option value="pyraminx">Pyraminx</option>
        </select>
        <div className="space-x-4 text-sm sm:text-xs">
          <button
            onClick={() => window.getWcaScramble(eventId).then(setScramble)}
            className="underline"
          >
            Previous Scramble
          </button>
          <button
            onClick={() => window.getWcaScramble(eventId).then(setScramble)}
            className="underline"
          >
            Next Scramble
          </button>
        </div>
      </div>
      <div className="text-4xl sm:text-2xl font-mono text-center leading-tight">{scramble}</div>
    </div>
  );
}