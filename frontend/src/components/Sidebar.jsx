import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import LogoutConfirm from "./LogoutConfirm";
import ProfileModal from "./ProfileModal";

export default function Sidebar({ solves = [], setDbSolvesExternal }) {
  const { user, token } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dbSolves, setDbSolves] = useState([]);

  // Expose a function to the parent so it can update dbSolves incrementally
  useEffect(() => {
    if (setDbSolvesExternal) {
      setDbSolvesExternal((updateFn) => {
        setDbSolves((prev) => {
          const updated =
            typeof updateFn === "function" ? updateFn(prev) : updateFn;
          return [...updated]; // ensures a new array identity and stable rerender
        });
      });
    }
  }, [setDbSolvesExternal]);

  // Fetch solves on initial load only
  useEffect(() => {
    if (!user || !token) return;

    const fetchSolves = async () => {
      try {
        const res = await fetch(`/api/v1/solves/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.solves) {
          setDbSolves(data.solves);
        }
      } catch (err) {
        console.error("Failed to fetch solves:", err);
      }
    };

    fetchSolves();
  }, []); // run once

  // Format time in seconds.deciseconds
  const format = (ms) => {
    const sec = Math.floor(ms / 1000);
    const dec = Math.floor((ms % 1000) / 10);
    return `${sec}.${dec.toString().padStart(2, "0")}`;
  };

  // Utility for averages
  const rawAvg = (arr) =>
    arr.length === 0 ? null : arr.reduce((a, b) => a + b, 0) / arr.length;

  // Memoize displayed solves to prevent flicker
  const displaySolves = useMemo(() => {
    return user ? dbSolves.map((s) => s.SOLVE_TIME) : solves;
  }, [dbSolves, solves, user]);

  const currentAo5 = format(rawAvg(displaySolves.slice(0, 5)) || 0);
  const currentAo12 = format(rawAvg(displaySolves.slice(0, 12)) || 0);

  const bestAo5 =
    displaySolves.length >= 5
      ? format(
          Math.min(
            ...displaySolves
              .map((_, i) => rawAvg(displaySolves.slice(i, i + 5)))
              .filter((v) => v !== null && !isNaN(v))
          )
        )
      : "--";

  const bestAo12 =
    displaySolves.length >= 12
      ? format(
          Math.min(
            ...displaySolves
              .map((_, i) => rawAvg(displaySolves.slice(i, i + 12)))
              .filter((v) => v !== null && !isNaN(v))
          )
        )
      : "--";

  const bestSingle = displaySolves.length
    ? format(Math.min(...displaySolves))
    : "00.00";
  const currentSingle = displaySolves[0]
    ? format(displaySolves[0])
    : "00.00";

  return (
    <div className="w-64 bg-[#6D7276] text-white flex flex-col justify-between p-3">
      <div className="flex flex-col space-y-4 overflow-hidden flex-grow">
        <div>
          <img src="/logo.jpg" alt="Cube Master Logo" className="w-full mb-0" />
          <div className="space-y-2 mt-0">
            <button className="w-full bg-[#29A7D1] text-white py-2 rounded text-sm">Timer</button>
            <button className="w-full bg-[#29A7D1] text-white py-2 rounded text-sm">Trainer</button>
            <button className="w-full bg-[#29A7D1] text-white py-2 rounded text-sm">Review</button>
          </div>
        </div>

        <div
          className="bg-[#B3B3B3] text-black p-2 rounded-lg"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          <div className="grid grid-cols-3 gap-1 text-sm">
            <div></div>
            <div className="font-bold">current</div>
            <div className="font-bold">best</div>

            <div>time</div>
            <div>{currentSingle}</div>
            <div>{bestSingle}</div>

            <div>ao5</div>
            <div>{currentAo5}</div>
            <div>{bestAo5}</div>

            <div>ao12</div>
            <div>{currentAo12}</div>
            <div>{bestAo12}</div>
          </div>
        </div>

        <div
          className="bg-[#B3B3B3] text-black p-2 overflow-y-auto rounded-lg flex-1"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">index</th>
                <th className="text-left">time</th>
                <th className="text-left">ao5</th>
                <th className="text-left">ao12</th>
              </tr>
            </thead>
            <tbody>
              {displaySolves.map((s, i) => {
                const ao5Slice = displaySolves.slice(i, i + 5);
                const ao12Slice = displaySolves.slice(i, i + 12);

                const ao5 =
                  ao5Slice.length === 5
                    ? format(ao5Slice.reduce((a, b) => a + b, 0) / 5)
                    : "--";

                const ao12 =
                  ao12Slice.length === 12
                    ? format(ao12Slice.reduce((a, b) => a + b, 0) / 12)
                    : "--";

                return (
                  <tr key={i} className="align-top">
                    <td>{displaySolves.length - i}</td>
                    <td>{format(s)}</td>
                    <td>{ao5}</td>
                    <td>{ao12}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3">
        <button
          className="text-white"
          onClick={() => {
            if (user) {
              setShowProfileModal(true);
            } else {
              setShowLoginModal(true);
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </button>

        {user && (
          <button className="text-white" onClick={() => setShowLogoutConfirm(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
        )}
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showLogoutConfirm && <LogoutConfirm onClose={() => setShowLogoutConfirm(false)} />}
      {showProfileModal && <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />}
    </div>
  );
}
