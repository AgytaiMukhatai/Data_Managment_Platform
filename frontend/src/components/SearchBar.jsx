// src/components/SearchBar.jsx
import { useState } from 'react';
import { FaSearch, FaUpload } from 'react-icons/fa';
import './dashboard.css';

export default function SearchBar({ onSearch, onOpenUploadModal }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    onSearch(text);
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearchClick();
      }}
      className="searchbar-container"
    >
      <input
        type="text"
        placeholder="Search datasets..."
        value={query}
        onChange={handleInputChange}
        className="searchbar-input"
      />

      <button type="submit" className="searchbar-button">
        <FaSearch />
      </button>

      <button
        type="button"
        className="upload-btn"
        style={{ marginLeft: '10px' }}
        onClick={onOpenUploadModal}
      >
        <FaUpload style={{ marginRight: '6px' }} />
        Upload
      </button>
    </form>
  );
}
