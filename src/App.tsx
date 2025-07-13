import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage/WelcomePage';
import ResourcesPage from './components/ResourcesPage/ResourcesPage';
import AdminPanel from './components/admin/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/recursos" element={<ResourcesPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
