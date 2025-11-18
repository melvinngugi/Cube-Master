export default function SolutionBar({
  beginnerSolution,
  advancedSolution,
}) {
  return (
    <div className="bg-white p-3 rounded shadow text-sm font-mono space-y-3">
      <div>
        <span className="font-bold">Efficient solution (beginner):</span>
        <div className="mt-1 break-words">
          {beginnerSolution || "--"}
        </div>
      </div>
      <div>
        <span className="font-bold">Efficient solution (advanced):</span>
        <div className="mt-1 break-words">
          {advancedSolution || "--"}
        </div>
      </div>
    </div>
  );
}
