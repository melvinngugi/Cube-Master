export default function SolutionBar({
  beginnerSolution,
  xcrossSolution,
  xxcrossSolution,
  xxxcrossSolution,
}) {
  return (
    <div className="bg-white p-3 rounded shadow text-sm font-mono space-y-3">
      <div>
        <span className="font-bold">Efficient cross (beginner):</span>
        <div className="mt-1 break-words">
          {beginnerSolution || "--"}
        </div>
      </div>
      <div>
        <span className="font-bold">Efficient cross (advanced):</span>
        <div className="mt-1 break-words space-y-1">
          <div><strong>XCross:</strong> {xcrossSolution || "--"}</div>
          <div><strong>XXCross:</strong> {xxcrossSolution || "--"}</div>
          <div><strong>XXXCross:</strong> {xxxcrossSolution || "--"}</div>
        </div>
      </div>
    </div>
  );
}
