import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import ScrambleBar from "../components/ScrambleBar";
import Sidebar from "../components/Sidebar";
import SolveGrid from "../components/SolveGrid";
import SolutionBar from "../components/SolutionBar";
import CubePreview from "../components/CubePreview";
import PerformanceChart from "../components/PerformanceChart";
import AddTimeModal from "../components/AddTimeModal";

export default function ReviewPage() {
  const { user, token } = useAuth();
  const [solves, setSolves] = useState([]);
  const [selectedSolve, setSelectedSolve] = useState(null);
  const [loading, setLoading] = useState(false);

  const [eventId, setEventId] = useState("333");
  const cubeMap = { "333": 1, "222": 2, pyram: 3 };
  const activeCubeId = cubeMap[eventId] ?? 1;

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

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
          const normalized = data.solves.map((s) => ({
            solve_id: s.SOLVE_ID,
            scramble_text: s.SCRAMBLE_TEXT,
            timestamp: s.TIMESTAMP,
            solve_time: Number(s.SOLVE_TIME),
            beginner_solution: s.BEGINNER_GENERATED_CROSS,
            xcross_solution: s.XCROSS_GENERATED_CROSS,
            xxcross_solution: s.XXCROSS_GENERATED_CROSS,
            xxxcross_solution: s.XXXCROSS_GENERATED_CROSS,
            cube_id: s.CUBE_ID,
            plus_two: s.PLUS_TWO === 1,
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

  const filteredSolves = useMemo(
    () => solves.filter((s) => s.cube_id === activeCubeId),
    [solves, activeCubeId]
  );

  const handleSelect = (solve) => setSelectedSolve(solve);

  const showSolutions = eventId === "333";

  const handleAddTime = async ({ time, scramble, cube }) => {
    if (!user || !token) return;
    const cubeId = cubeMap[cube] ?? 1;
    setSaving(true);

    try {
      const res = await fetch("/api/v1/solves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          scramble_text: scramble,
          solve_time: time * 1000,
          cube_id: cubeId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const newSolve = {
          solve_id: data.solveId,
          scramble_text: scramble,
          solve_time: time * 1000,
          timestamp: new Date().toISOString(),
          beginner_solution: data.solutions?.beginner ?? null,
          xcross_solution: data.solutions?.xcross ?? null,
          xxcross_solution: data.solutions?.xxcross ?? null,
          xxxcross_solution: data.solutions?.xxxcross ?? null,
          cube_id: cubeId,
          plus_two: false,
        };
        setSolves((prev) => [newSolve, ...prev]);
        setSelectedSolve(newSolve);
      } else {
        console.error("Failed to add time:", data);
      }
    } catch (err) {
      console.error("Error adding time:", err);
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

  // Toggle +2 penalty handler
  const handlePlusTwo = async () => {
    if (!selectedSolve || !token) return;
    try {
      const res = await fetch(`/api/v1/solves/${selectedSolve.solve_id}/plus2`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const newTime = Number(data.newTime);
        const newPlusTwo = data.plus_two === 1;

        const updated = {
          ...selectedSolve,
          solve_time: newTime,
          plus_two: newPlusTwo,
        };

        setSolves((prev) =>
          prev.map((s) => (s.solve_id === updated.solve_id ? updated : s))
        );
        setSelectedSolve(updated);
      } else {
        console.error("Toggle +2 failed:", data);
      }
    } catch (err) {
      console.error("Error toggling +2:", err);
    }
  };

  // Delete handler with confirmation
  const handleDelete = async () => {
    if (!selectedSolve || !token) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this solve?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/v1/solves/${selectedSolve.solve_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSolves((prev) =>
          prev.filter((s) => s.solve_id !== selectedSolve.solve_id)
        );
        setSelectedSolve(null);
      }
    } catch (err) {
      console.error("Error deleting solve:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#B4B6B9]">
      <Sidebar
        solves={filteredSolves}
        user={user}
        isAuthenticated={!!token}
        eventId={eventId}
      />

      <div className="flex flex-col flex-1 relative">
        <ScrambleBar
          scramble={selectedSolve?.scramble_text}
          eventId={eventId}
          setEventId={setEventId}
        />

        <div className="flex flex-1 overflow-hidden mt-24">
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

          {/* Right side */}
          <div className="w-1/3 px-4 py-4 flex flex-col items-center space-y-4">
            {/* Add Time button */}
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-[#29A7D1] text-white rounded shadow hover:opacity-90"
            >
              Add Time
            </button>

            {/* +2 and Delete buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handlePlusTwo}
                disabled={!selectedSolve}
                className={`px-4 py-2 rounded shadow ${
                  selectedSolve
                    ? "bg-[#29A7D1] text-white hover:opacity-90"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {selectedSolve?.plus_two ? "Undo +2" : "+2"}
              </button>
              <button
                onClick={handleDelete}
                disabled={!selectedSolve}
                className={`px-4 py-2 rounded shadow ${
                  selectedSolve
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Delete
              </button>
            </div>

            <CubePreview scramble={selectedSolve?.scramble_text} eventId={eventId} />
            <PerformanceChart solves={filteredSolves} />
          </div>
        </div>

        {loading && (
          <div className="absolute bottom-4 right-4 text-xs text-gray-200">
            Syncing…
          </div>
        )}

        <AddTimeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAddTime}
          saving={saving}
        />
      </div>
    </div>
  );
}
