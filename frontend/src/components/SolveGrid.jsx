import { formatMsToSecDeci } from "../utils/format";

export default function SolveGrid({ solves, selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 overflow-y-auto p-3 rounded">
      {solves.length === 0 ? (
        <div className="text-sm text-gray-500">No solves yet.</div>
      ) : (
        solves.map((solve, index) => {
          const rawTime = solve.solve_time ?? solve.SOLVE_TIME;
          const timeMs =
            typeof rawTime === "number"
              ? rawTime < 1000 ? rawTime * 1000 : rawTime
              : Number(rawTime);

          const displayTime = isNaN(timeMs)
            ? "00.00"
            : formatMsToSecDeci(timeMs);

          // Format TIMESTAMP from DB as DD/MM/YY
          const timestamp = solve.TIMESTAMP
            ? new Date(solve.TIMESTAMP).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : "--";

          return (
            <button
              key={
                solve.solve_id ??
                `${timestamp}-${displayTime}-${index}`
              }
              onClick={() => onSelect(solve)}
              className="flex flex-col items-start px-2 py-1 rounded shadow"
              style={{
                backgroundColor: "#D9D9D9",
                width: "100px",
                height: "55px",
              }}
              title={solve.scramble_text || ""}
            >
              {/* Date top-left */}
              <div className="text-xs text-black">{timestamp}</div>

              {/* Main solve time */}
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
