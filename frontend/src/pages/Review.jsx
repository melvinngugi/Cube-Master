import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ScrambleBar from "../components/ScrambleBar";
import Sidebar from "../components/Sidebar";
import SolveGrid from "../components/SolveGrid";
import SolutionBar from "../components/SolutionBar";
import CubePreview from "../components/CubePreview";

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

        {/* Middle and right sections */}
        <div className="flex flex-1 overflow-hidden mt-24">
          {/* Middle: solve list + solutions */}
          <div className="flex flex-col w-2/3 px-6 py-4 space-y-4 overflow-y-auto">
            <SolveGrid
              solves={solves}
              selectedId={selectedSolve?.solve_id}
              onSelect={handleSelect}
            />
            <SolutionBar
              beginnerSolution={selectedSolve?.beginner_generated_solution}
              advancedSolution={selectedSolve?.advanced_generated_solution}
            />
          </div>

          {/* Right: cube preview + chart */}
          <div className="w-1/3 px-4 py-4 flex flex-col items-center space-y-4">
            <CubePreview scramble={selectedSolve?.scramble_text} />
            <div className="bg-white rounded shadow w-full h-64 flex items-center justify-center text-gray-500 font-mono text-sm">
              Performance chart coming soon
            </div>
          </div>
        </div>

        {/* loading indicator */}
        {loading && (
          <div className="absolute bottom-4 right-4 text-xs text-gray-200">
            Syncing…
          </div>
        )}
      </div>
    </div>
  );
}
