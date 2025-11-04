import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TimerDashboard from './pages/TimerDashboard';
import Trainer from './pages/Trainer';
import Review from './pages/Review';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TimerDashboard />} />
        <Route
          path="/trainer"
          element={
            <ProtectedRoute>
              <Trainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;