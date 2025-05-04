// src/components/SearchBar.jsx
import { useState } from 'react';
import { FaSearch, FaUpload } from 'react-icons/fa';
import './dashboard.css'; // On utilise le même CSS global

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    onSearch(text); // Remonte la recherche au parent
  };

  const handleSearchClick = () => {
    onSearch(query); // Rechercher aussi si l'utilisateur clique sur la loupe
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
    </form>
  );
}
