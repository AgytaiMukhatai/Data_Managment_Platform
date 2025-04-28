// src/components/Sidebar.jsx
import './dashboard.css'; // Toujours le même fichier CSS global

export default function Sidebar({ onFilter }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/Images/Logo-sans arriere plan.png" alt="Logo" />
      </div>
      <div className="sidebar-title">
        <h2>Modalities</h2>
      </div>
      <nav className="sidebar-menu">
        <ul>
          <li onClick={() => onFilter('All')}>All Datasets</li>
          <li onClick={() => onFilter('Text')}>Texts</li>
          <li onClick={() => onFilter('Image')}>Images</li>
          <li onClick={() => onFilter('Video')}>Videos</li>
          <li onClick={() => onFilter('Audio')}>Audios</li>
          <li onClick={() => onFilter('Numerical')}>Numerical</li>
          <li onClick={() => onFilter('Tabular')}>Tabular</li>
        </ul>
      </nav>
    </aside>
  );
}
