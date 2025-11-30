import { formatMsToSecDeci } from "../utils/format";

function normalizeTimeToMs(raw) {
  const n = Number(raw);
  if (Number.isNaN(n)) return NaN;

  const hasDecimal = String(raw).includes(".");

  // Heuristics:
  // - Values >= 1000 are almost certainly milliseconds
  // - Values between 0 and 60 with a decimal are usually seconds (e.g., 4.67, 0.47) → convert to ms
  // - Small integers < 60 can be seconds (e.g., 7) → convert to ms
  // - Otherwise, assume milliseconds
  if (n >= 1000) return n;                // ms
  if (n > 0 && n <= 60 && hasDecimal) return n * 1000; // seconds → ms
  if (n > 0 && n <= 60 && !hasDecimal) return n * 1000; // seconds → ms
  return n;                                // fallback: ms
}

export default function SolveGrid({ solves, selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 overflow-y-auto p-3 rounded">
      {solves.length === 0 ? (
        <div className="text-sm text-gray-500">No solves yet.</div>
      ) : (
        solves.map((solve, index) => {
          const timeMs = normalizeTimeToMs(solve.solve_time);

          const displayTime = Number.isNaN(timeMs)
            ? "00.00"
            : formatMsToSecDeci(timeMs);

          const timestamp = solve.timestamp
            ? new Date(solve.timestamp).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : "--";

          const isSelected = selectedId === solve.solve_id;

          return (
            <button
              key={solve.solve_id ?? `${timestamp}-${displayTime}-${index}`}
              onClick={() => onSelect(solve)}
              className={`flex flex-col items-start px-2 py-1 rounded shadow transition-transform duration-150 ease-in-out ${
                isSelected
                  ? "bg-gray-350 border-2 border-black"
                  : "bg-[#D9D9D9] hover:scale-105 hover:shadow-md"
              }`}
              style={{ width: "111px", height: "60px" }}
              title={solve.scramble_text || ""}
            >
              <div className="text-xs text-black">{timestamp}</div>
              <div className="flex-1 flex items-center justify-center w-full">
                <span className="text-xl font-bold text-black">
                  {displayTime}
                </span>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
