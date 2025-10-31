import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TimerDashboard from './pages/TimerDashboard';
import Trainer from './pages/Trainer';
import Review from './pages/Review';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TimerDashboard />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </Router>
  );
}

export default App;