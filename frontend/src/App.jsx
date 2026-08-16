import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import Upload from './pages/Upload';
import Milestones from './pages/Milestones';
import MonthlyNotes from './pages/MonthlyNotes';
import PublicGallery from './pages/PublicGallery';
import Calendar from './pages/Calendar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Public routes - accessible without login */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notes" element={<MonthlyNotes />} />
          <Route path="/public/:token" element={<PublicGallery />} />
          
          {/* Protected routes - require login */}
          <Route path="/upload" element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
