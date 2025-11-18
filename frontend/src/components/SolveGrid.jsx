import { formatMsToSecDeci } from "../utils/format";

export default function SolveGrid({ solves, selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 overflow-y-auto bg-white p-3 rounded shadow">
      {solves.length === 0 ? (
        <div className="text-sm text-gray-500">No solves yet.</div>
      ) : (
        solves.map((solve) => {
          const rawTime = solve.solve_time;
          const timeMs = typeof rawTime === "number"
            ? rawTime < 1000 ? rawTime * 1000 : rawTime
            : 0;

          return (
            <button
              key={solve.solve_id ?? `${solve.timestamp}-${rawTime}`}
              onClick={() => onSelect(solve)}
              className={`px-3 py-2 rounded text-sm font-mono shadow transition-colors ${
                selectedId === solve.solve_id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
              title={solve.scramble_text || ""}
            >
              {formatMsToSecDeci(timeMs)}
            </button>
          );
        })
      )}
    </div>
  );
}
