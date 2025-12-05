import { useEffect, useMemo, useRef, useState } from "react";

export default function useSolves({ user, token, eventId }) {
  const cubeMap = { "333": 1, "222": 2, pyram: 3 };

  const [solvesByCube, setSolvesByCube] = useState({
    1: [],
    2: [],
    3: [],
  });

  const [unsynced, setUnsynced] = useState([]);
  const loginRef = useRef({ userId: null, token: null });

  const activeCubeId = cubeMap[eventId] ?? 1;

  const getSolvesForCube = (cubeId) => solvesByCube[cubeId] ?? [];

  const replaceAllForCube = (cubeId, arr) => {
    setSolvesByCube((prev) => ({ ...prev, [cubeId]: arr || [] }));
  };

  const format = (ms) => {
    if (typeof ms !== "number" || Number.isNaN(ms)) return "--.--";
    const sec = Math.floor(ms / 1000);
    const dec = Math.floor((ms % 1000) / 10);
    return `${sec}.${dec.toString().padStart(2, "0")}`;
  };

  const displaySolves = useMemo(() => {
    return (solvesByCube[activeCubeId] || [])
      .map((s) =>
        typeof s.solve_time === "number" ? s.solve_time : Number(s.solve_time)
      )
      .filter((n) => !Number.isNaN(n));
  }, [solvesByCube, activeCubeId]);

  const rawAvg = (arr) =>
    arr.length === 0 ? null : arr.reduce((a, b) => a + b, 0) / arr.length;

  const currentSingle = displaySolves.length ? format(displaySolves[0]) : "00.00";

  const bestSingle = displaySolves.length
    ? format(Math.min(...displaySolves))
    : "00.00";

  const currentAo5 =
    displaySolves.length >= 5
      ? format(rawAvg(displaySolves.slice(0, 5)) || 0)
      : "--";

  const currentAo12 =
    displaySolves.length >= 12
      ? format(rawAvg(displaySolves.slice(0, 12)) || 0)
      : "--";

  const bestAo5 =
    displaySolves.length >= 5
      ? format(
          Math.min(
            ...displaySolves
              .map((_, i) => rawAvg(displaySolves.slice(i, i + 5)))
              .filter((v) => v !== null && !Number.isNaN(v))
          )
        )
      : "--";

  const bestAo12 =
    displaySolves.length >= 12
      ? format(
          Math.min(
            ...displaySolves
              .map((_, i) => rawAvg(displaySolves.slice(i, i + 12)))
              .filter((v) => v !== null && !Number.isNaN(v))
          )
        )
      : "--";

  const addSolve = async (newSolve, eventIdForSolve) => {
    const cubeId = cubeMap[eventIdForSolve] ?? 1;

    const clientId = `${newSolve.timestamp}-${Math.random().toString(36).slice(
      2
    )}`;

    const optimistic = { ...newSolve, cube_id: cubeId, client_id: clientId };

    setSolvesByCube((prev) => ({
      ...prev,
      [cubeId]: [optimistic, ...(prev[cubeId] || [])],
    }));

    if (!user || !token) return;

    setUnsynced((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/v1/solves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          scramble_text: newSolve.scramble_text,
          solve_time: newSolve.solve_time,
          cube_id: cubeId,
          beginner_generated_solution:
            eventIdForSolve === "333"
              ? newSolve.beginner_generated_solution ?? null
              : null,
          advanced_generated_solution:
            eventIdForSolve === "333"
              ? newSolve.advanced_generated_solution ?? null
              : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSolvesByCube((prev) => ({
          ...prev,
          [cubeId]: (prev[cubeId] || []).map((s) =>
            s.client_id === clientId ? { ...s, solve_id: data.solve_id } : s
          ),
        }));

        setUnsynced((prev) => prev.filter((s) => s.client_id !== clientId));
      } else {
        console.error("Failed to save solve:", data);
      }
    } catch (err) {
      console.error("Error saving solve:", err);
    }
  };

  const editSolve = async (updatedSolve) => {
    const { cube_id } = updatedSolve;

    setSolvesByCube((prev) => ({
      ...prev,
      [cube_id]: (prev[cube_id] || []).map((s) =>
        (s.solve_id && updatedSolve.solve_id && s.solve_id === updatedSolve.solve_id) ||
        (s.client_id &&
          updatedSolve.client_id &&
          s.client_id === updatedSolve.client_id)
          ? { ...s, ...updatedSolve }
          : s
      ),
    }));

    if (user && token && updatedSolve.solve_id) {
      try {
        await fetch(`/api/v1/solves/${updatedSolve.solve_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedSolve),
        });
      } catch (err) {
        console.error("Error editing solve:", err);
      }
    }
  };

  useEffect(() => {
    if (!user || !token) return;

    const alreadyLoaded =
      loginRef.current.userId === user.id &&
      loginRef.current.token === token;

    loginRef.current = { userId: user.id, token };

    if (alreadyLoaded) return;

    const fetchSolves = async () => {
      try {
        const res = await fetch(`/api/v1/solves/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (Array.isArray(data.solves)) {
          const normalized = data.solves.map((s) => ({
            solve_id: s.SOLVE_ID,
            scramble_text: s.SCRAMBLE_TEXT,
            timestamp: Number(s.TIMESTAMP),
            solve_time: Number(s.SOLVE_TIME),
            cube_id: s.CUBE_ID ?? 1,
          }));

          normalized.sort((a, b) => b.timestamp - a.timestamp);

          const byCube = { 1: [], 2: [], 3: [] };

          for (const s of normalized) {
            const cid = s.cube_id ?? 1;
            byCube[cid].push(s);
          }

          setSolvesByCube(byCube);
          setUnsynced([]);
        }
      } catch (err) {
        console.error("Failed to fetch solves:", err);
      }
    };

    fetchSolves();
  }, [user, token]);

  return {
    solvesByCube,
    unsynced,
    getSolvesForCube,
    displaySolves,
    stats: {
      currentSingle: currentSingle ?? "00.00",
      bestSingle: bestSingle ?? "00.00",
      currentAo5: currentAo5 ?? "--",
      currentAo12: currentAo12 ?? "--",
      bestAo5: bestAo5 ?? "--",
      bestAo12: bestAo12 ?? "--",
    },
    addSolve,
    editSolve,
    replaceAllForCube,
    format,
    activeCubeId,
  };
}
