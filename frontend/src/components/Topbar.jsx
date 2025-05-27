// src/components/Topbar.jsx
import './Topbar.css';
import SearchBar from './SearchBar';
import defaultAvatar from '/Images/user (1).png'


export default function Topbar({ setActivePage }) {
  return (
   <header className="topbar">
      <div className="topbar-left" onClick={() => setActivePage('datasets')}>
            <img src="/Images/LogoHub.png" alt="Logo" className="topbar-logo" />
     </div>
          
      <div className="topbar-center">
        <SearchBar/>
      </div>

      <div className="topbar-right">
        <button className="topbar-btn" onClick={() => setActivePage('datasets')}>
          Datasets
        </button>
        
        <button className="topbar-icon" onClick={() => setActivePage('profile')}>
          <img src={defaultAvatar} alt="Profile" className="topbar-avatar" />
        </button>

      </div>
    </header>
  );
}
