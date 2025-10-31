import Sidebar from '../components/Sidebar';
import ScrambleBar from '../components/ScrambleBar';
import TimerDisplay from '../components/TimerDisplay';
import CubePreview from '../components/CubePreview';

export default function TimerDashboard() {
  return (
    <div className="flex h-screen bg-[#B4B6B9]">
      <Sidebar />
      <div className="flex flex-col flex-1 relative">
        <ScrambleBar />
        <div className="flex-1 flex items-center justify-center mt-16">
          <TimerDisplay />
        </div>
        <div className="absolute bottom-6 right-6">
          <CubePreview />
        </div>
      </div>
    </div>
  );
}