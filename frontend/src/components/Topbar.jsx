import { useContext } from 'react';
import { FaSearch, FaUpload } from 'react-icons/fa';
import { UserContext } from '../contexts/UserContext';  // Assure-toi du bon chemin
import './dashboard.css';

export default function Topbar({ onOpenUploadModal, searchQuery, setSearchQuery, onSearchSubmit }) {
  const { user } = useContext(UserContext);

  return (
    <header className="topbar">
      {/* Profile Picture on the left */}
      <div className="topbar-left">
        <img 
          src={user.profilePic || '/Images/userImage.jpeg'} 
          alt="Profile" 
          className="profile-pic" 
        />
      </div>

      {/* Search Bar in the center */}
      <div className="topbar-center">
        <form onSubmit={onSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search datasets, models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Upload Button on the right */}
      <div className="topbar-right">
        <button className="upload-btn" onClick={onOpenUploadModal}>
          <FaUpload style={{ marginRight: '8px' }} />
          Upload
        </button>
      </div>
    </header>
  );
}
