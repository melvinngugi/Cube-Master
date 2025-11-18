import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ScrambleBar from "../components/ScrambleBar";
import Sidebar from "../components/Sidebar";
import SolveGrid from "../components/SolveGrid";
import SolutionBar from "../components/SolutionBar";

export default function ReviewPage() {
  const { user, token } = useAuth();
  const [solves, setSolves] = useState([]);
  const [selectedSolve, setSelectedSolve] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSolves = async () => {
      if (!user || !token) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/solves/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data.solves)) {
          setSolves(data.solves);
          setSelectedSolve((prev) => prev ?? data.solves[0] ?? null);
        }
      } catch (err) {
        console.error("Failed to fetch solves:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolves();
  }, [user, token]);

  const handleSelect = (solve) => setSelectedSolve(solve);

  return (
    <div className="flex h-screen bg-[#B4B6B9]">
      {/* Sidebar */}
      <Sidebar solves={solves} user={user} isAuthenticated={!!token} />

      {/* Main content */}
      <div className="flex flex-col flex-1 relative">
        {/* Scramble bar */}
        <ScrambleBar scramble={selectedSolve?.scramble_text} />

        {/* Solve grid */}
        <div className="flex-1 overflow-y-auto mt-24 px-6 py-4">
          <SolveGrid
            solves={solves}
            selectedId={selectedSolve?.solve_id}
            onSelect={handleSelect}
          />
        </div>

        {/* Solution bar */}
        <div className="px-6 pb-6">
          <SolutionBar
            beginnerSolution={selectedSolve?.beginner_generated_solution}
            advancedSolution={selectedSolve?.advanced_generated_solution}
          />
        </div>

        {/* Optional loading indicator */}
        {loading && (
          <div className="absolute bottom-4 right-4 text-xs text-gray-200">
            Syncing…
          </div>
        )}
      </div>
    </div>
  );
}
