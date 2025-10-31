import { useState } from "react";
import useTimer from "../hooks/useTimer";
import ScrambleBar from "../components/ScrambleBar";
import CubePreview from "../components/CubePreview";
import TimerDisplay from "../components/TimerDisplay";
import Sidebar from "../components/Sidebar";

export default function TimerDashboard() {
  const [scramble, setScramble] = useState("");
  const [eventId, setEventId] = useState("333");
  const [focusMode, setFocusMode] = useState(false);

  const { time, running, solves, armed, ready } = useTimer(setScramble, setFocusMode);

  return (
    <div className="flex h-screen bg-[#B4B6B9]">
      {!focusMode && <Sidebar solves={solves} />}
      <div className="flex flex-col flex-1 relative">
        {!focusMode && (
          <ScrambleBar scramble={scramble} setScramble={setScramble} eventId={eventId} />
        )}
        <div className="flex-1 flex items-center justify-center mt-16">
          <TimerDisplay
            time={time}
            solves={solves}
            armed={armed}
            ready={ready}
            running={running}
            focusMode={focusMode}
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