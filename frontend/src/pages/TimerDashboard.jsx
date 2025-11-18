import { useState } from "react";
import useTimer from "../hooks/useTimer";
import ScrambleBar from "../components/ScrambleBar";
import CubePreview from "../components/CubePreview";
import TimerDisplay from "../components/TimerDisplay";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function TimerDashboard() {
  const { user, token } = useAuth(); // access auth state
  const [scramble, setScramble] = useState("");
  const [eventId, setEventId] = useState("333");
  const [focusMode, setFocusMode] = useState(false);

  const { time, running, solves, armed, ready } = useTimer(
    setScramble,
    setFocusMode
  );

  // store sidebar helpers (addSolve, editSolve, replaceAll)
  const [sidebarHelpers, setSidebarHelpers] = useState(null);

  // callback to update sidebar instantly after a solve is saved
  const handleSolveSaved = (newSolve) => {
    if (sidebarHelpers?.addSolve) {
      sidebarHelpers.addSolve(newSolve);
    }
  };

  return (
    <div className="flex h-screen bg-[#B4B6B9]">
      {!focusMode && (
        <Sidebar
          solves={solves}
          user={user}
          isAuthenticated={!!token}
          setDbSolvesExternal={setSidebarHelpers} // capture helpers from Sidebar
        />
      )}
      <div className="flex flex-col flex-1 relative">
        {!focusMode && (
          <ScrambleBar
            scramble={scramble}
            setScramble={setScramble}
            eventId={eventId}
          />
        )}
        <div className="flex-1 flex items-center justify-center mt-16">
          <TimerDisplay
            time={time}
            solves={solves}
            armed={armed}
            ready={ready}
            running={running}
            focusMode={focusMode}
            scramble={scramble}   //pass scramble down
            user={user}           //pass user down
            token={token}         //pass token down
            onSolveSaved={handleSolveSaved} //pass callback down
          />
        </div>
        {!focusMode && (
          <div className="absolute bottom-6 right-6">
            <CubePreview scramble={scramble} />
          </div>
        )}
      </div>
    </div>
  );
}
