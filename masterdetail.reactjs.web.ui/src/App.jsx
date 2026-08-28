import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/common/NavBar';
import LandingPage from './pages/LandingPage';
import MasterDetailPage from './pages/MasterDetailPage.jsx';
import DetailChildPage from './pages/DetailChildPage.jsx';
import ChildPage from './pages/ChildPage.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/master-detail" element={<MasterDetailPage />} />
          <Route path="/detail-child" element={<DetailChildPage />} />
          <Route path="/child" element={<ChildPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
