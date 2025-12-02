import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import ScrambleBar from "../components/ScrambleBar";
import Sidebar from "../components/Sidebar";
import SolveGrid from "../components/SolveGrid";
import SolutionBar from "../components/SolutionBar";
import CubePreview from "../components/CubePreview";
import PerformanceChart from "../components/PerformanceChart";

export default function ReviewPage() {
  const { user, token } = useAuth();
  const [solves, setSolves] = useState([]);
  const [selectedSolve, setSelectedSolve] = useState(null);
  const [loading, setLoading] = useState(false);

  // cube filter state
  const [eventId, setEventId] = useState("333"); // default 3x3
  const cubeMap = { "333": 1, "222": 2, pyram: 3 };
  const activeCubeId = cubeMap[eventId] ?? 1;

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
          // Normalize DB fields to camelCase
          const normalized = data.solves.map((s) => ({
            solve_id: s.SOLVE_ID,
            scramble_text: s.SCRAMBLE_TEXT,
            timestamp: s.TIMESTAMP,
            solve_time: s.SOLVE_TIME,
            beginner_solution: s.BEGINNER_GENERATED_CROSS,
            xcross_solution: s.XCROSS_GENERATED_CROSS,
            xxcross_solution: s.XXCROSS_GENERATED_CROSS,
            xxxcross_solution: s.XXXCROSS_GENERATED_CROSS,
            cube_id: s.CUBE_ID,
          }));

          setSolves(normalized);
          setSelectedSolve((prev) => prev ?? normalized[0] ?? null);
        }
      } catch (err) {
        console.error("Failed to fetch solves:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolves();
  }, [user, token]);

  // Filter solves by cube type
  const filteredSolves = useMemo(
    () => solves.filter((s) => s.cube_id === activeCubeId),
    [solves, activeCubeId]
  );

  const handleSelect = (solve) => setSelectedSolve(solve);

  // Determine if we should show solution bar (only for 3x3)
  const showSolutions = eventId === "333";

  return (
    <div className="flex h-screen bg-[#B4B6B9]">
      {/* Sidebar */}
      <Sidebar
        solves={filteredSolves}
        user={user}
        isAuthenticated={!!token}
        eventId={eventId}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 relative">
        {/* Scramble bar with dropdown */}
        <ScrambleBar
          scramble={selectedSolve?.scramble_text}
          eventId={eventId}
          setEventId={setEventId}
        />

        {/* Middle and right sections */}
        <div className="flex flex-1 overflow-hidden mt-24">
          {/* Middle: solve list + solutions */}
          <div className="flex flex-col w-2/3 px-6 py-4 space-y-4 overflow-y-auto">
            <SolveGrid
              solves={filteredSolves}
              selectedId={selectedSolve?.solve_id}
              onSelect={handleSelect}
            />
            {showSolutions && selectedSolve && (
              <SolutionBar
                beginnerSolution={selectedSolve?.beginner_solution}
                xcrossSolution={selectedSolve?.xcross_solution}
                xxcrossSolution={selectedSolve?.xxcross_solution}
                xxxcrossSolution={selectedSolve?.xxxcross_solution}
              />
            )}
          </div>

          {/* Right: cube preview + chart */}
          <div className="w-1/3 px-4 py-4 flex flex-col items-center space-y-4">
            <CubePreview scramble={selectedSolve?.scramble_text} eventId={eventId} />
            <PerformanceChart solves={filteredSolves} />
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
