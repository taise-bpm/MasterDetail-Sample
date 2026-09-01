import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/common/NavBar';
import LandingPage from './pages/LandingPage';
import MasterDetailPage from './pages/MasterDetailPage.jsx';
import DetailChildPage from './pages/DetailChildPage.jsx';
import MasterPage from './pages/MasterPage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import ChildPage from './pages/ChildPage.jsx';
import ControlsDemoPage from './pages/ControlsDemoPage.jsx';
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
          <Route path="/master" element={<MasterPage />} />
          <Route path="/detail" element={<DetailPage />} />
          <Route path="/child" element={<ChildPage />} />
          <Route path="/controls-demo" element={<ControlsDemoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
