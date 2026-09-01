import { NavLink } from 'react-router-dom';
import './layout.css';

const NavBar = () => (
  <nav className="app-navbar">
    <NavLink to="/" end className="app-navbar__brand">
      MasterDetail
    </NavLink>
    <div className="app-navbar__links">
      <NavLink to="/master-detail" className={({ isActive }) => (isActive ? 'active' : '')}>
        Master / Detail
      </NavLink>
      <NavLink to="/detail-child" className={({ isActive }) => (isActive ? 'active' : '')}>
        Detail / Child
      </NavLink>
      <NavLink to="/master" className={({ isActive }) => (isActive ? 'active' : '')}>
        Masters
      </NavLink>
      <NavLink to="/detail" className={({ isActive }) => (isActive ? 'active' : '')}>
        Details
      </NavLink>
      <NavLink to="/child" className={({ isActive }) => (isActive ? 'active' : '')}>
        Children
      </NavLink>
      <NavLink to="/controls-demo" className={({ isActive }) => (isActive ? 'active' : '')}>
        Controls Demo
      </NavLink>
    </div>
  </nav>
);

export default NavBar;
