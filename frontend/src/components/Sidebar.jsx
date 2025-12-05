import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import LogoutConfirm from "./LogoutConfirm";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  solvesForActiveCube = [],
  eventId,
  stats,
  format,
}) {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const navigate = useNavigate();

  //Convert solve_time values to numbers
  const displaySolves = useMemo(() => {
    return solvesForActiveCube
      .map((s) =>
        typeof s.solve_time === "number" ? s.solve_time : Number(s.solve_time)
      )
      .filter((n) => !Number.isNaN(n));
  }, [solvesForActiveCube]);

  const renderSolves = displaySolves;

  const latestSolve = renderSolves[0];

  const currentAo5Slice = renderSolves.slice(0, 5);
  const currentAo12Slice = renderSolves.slice(0, 12);

  const currentSingle = latestSolve ? format(latestSolve) : "--";

  const currentAo5 =
    currentAo5Slice.length === 5
      ? format(currentAo5Slice.reduce((a, b) => a + b, 0) / 5)
      : "--";

  const currentAo12 =
    currentAo12Slice.length === 12
      ? format(currentAo12Slice.reduce((a, b) => a + b, 0) / 12)
      : "--";

  const bestSingle = stats?.bestSingle || "--";
  const bestAo5 = stats?.bestAo5 || "--";
  const bestAo12 = stats?.bestAo12 || "--";

  const cubeLabel =
    eventId === "333" ? "3×3×3" : eventId === "222" ? "2×2×2" : "Pyraminx";

  return (
    <div className="w-64 bg-[#6D7276] text-white h-screen sticky top-0 flex flex-col justify-between p-3">
      <div className="flex flex-col space-y-4 overflow-hidden flex-grow">
        <div>
          <img src="/logo.jpg" alt="Cube Master Logo" className="w-full mb-0" />

          <div className="space-y-2 mt-0">
            <button
              className="w-full bg-[#29A7D1] text-white py-2 rounded text-sm"
              onClick={() => navigate("/")}
            >
              Timer
            </button>
            <button
              className="w-full bg-[#29A7D1] text-white py-2 rounded text-sm"
              onClick={() => navigate("/trainer")}
            >
              Trainer
            </button>
            <button
              className="w-full bg-[#29A7D1] text-white py-2 rounded text-sm"
              onClick={() => navigate("/review")}
            >
              Review
            </button>
          </div>
        </div>

        {/*Small Stats Table*/}
        <div
          className="bg-[#B3B3B3] text-black p-2 rounded-lg"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-semibold">Showing:</span>
            <span className="px-2 py-0.5 rounded bg-[#D9D9D9]">{cubeLabel}</span>
          </div>

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

        {/*Big Solve Table*/}
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
              {renderSolves.map((timeValue, renderIndex) => {
                const ao5Slice = renderSolves.slice(renderIndex, renderIndex + 5);
                const ao12Slice = renderSolves.slice(
                  renderIndex,
                  renderIndex + 12
                );

                const ao5 =
                  ao5Slice.length === 5
                    ? format(ao5Slice.reduce((a, b) => a + b, 0) / 5)
                    : "--";

                const ao12 =
                  ao12Slice.length === 12
                    ? format(ao12Slice.reduce((a, b) => a + b, 0) / 12)
                    : "--";

                //Newest solve = index 1
                const indexNumber = renderIndex + 1;

                return (
                  <tr key={renderIndex} className="align-top">
                    <td>{indexNumber}</td>
                    <td>{format(timeValue)}</td>
                    <td>{ao5}</td>
                    <td>{ao12}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/*Footer*/}
      <div className="flex justify-between items-center pt-3">
        <button
          className="text-white"
          onClick={() => {
            if (user) setShowProfileModal(true);
            else setShowLoginModal(true);
          }}
          title={user ? "Profile" : "Login"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </button>

        {user && (
          <button
            className="text-white"
            onClick={() => setShowLogoutConfirm(true)}
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </button>
        )}
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showLogoutConfirm && (
        <LogoutConfirm onClose={() => setShowLogoutConfirm(false)} />
      )}
      {showProfileModal && (
        <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}
