import { useState } from "react";
import ScrambleBar from "../components/ScrambleBar";
import CubePreview from "../components/CubePreview";
import TimerDisplay from "../components/TimerDisplay";
import Sidebar from "../components/Sidebar";

export default function TimerDashboard() {
  const [scramble, setScramble] = useState("");
  const [eventId, setEventId] = useState("333");

  return (
    <div className="flex h-screen bg-[#B4B6B9]">
      <Sidebar />
      <div className="flex flex-col flex-1 relative">
        <ScrambleBar scramble={scramble} setScramble={setScramble} eventId={eventId} />
        <div className="flex-1 flex items-center justify-center mt-16">
          <TimerDisplay />
        </div>
        <div className="absolute bottom-6 right-6">
          <CubePreview scramble={scramble} />
        </div>
      </div>
    </div>
  );
}