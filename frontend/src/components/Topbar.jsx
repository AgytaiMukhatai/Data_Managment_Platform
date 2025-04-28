import { Link } from 'react-router-dom';
import './dashboard.css'; // Toujours le même CSS global

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-center-left">
        <h1 className="dashboard-title">Welcome to Dashboard</h1>
      </div>
      <div className="topbar-right">
        <Link to="/login" className="logout-btn">Logout</Link>
      </div>
    </header>
  );
}
