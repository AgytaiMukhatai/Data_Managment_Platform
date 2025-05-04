import './dashboard.css'; // On utilise le même fichier de style

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/Images/Logo-sans arriere plan.png" alt="Logo" />
      </div>
      <nav className="sidebar-menu">
        <ul>
          <li
            className={activePage === 'profile' ? 'active' : ''}
            onClick={() => setActivePage('profile')}
          >
            Profile
          </li>
          <li
            className={activePage === 'datasets' ? 'active' : ''}
            onClick={() => setActivePage('datasets')}
          >
            Datasets
          </li>
        </ul>
      </nav>

      <button className="logout-btn" onClick={() => window.location.href = '/login'}>
        Logout
      </button>
    </aside>
  );
}
