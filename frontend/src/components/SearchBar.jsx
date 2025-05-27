import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import './Searchbar.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ datasets: [], users: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef(null);
  const containerRef = useRef(null);

  const fetchSearchResults = async (text) => {
    if (!text.trim()) {
      setResults({ datasets: [], users: [] });
      setShowDropdown(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/search/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
      setShowDropdown(true);
    } catch (error) {
      console.error(error);
      setResults({ datasets: [], users: [] });
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchSearchResults(text);
    }, 300);
  };

  const handleSearchClick = () => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    fetchSearchResults(query);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="searchbar-wrapper" ref={containerRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchClick();
        }}
        className="searchbar-container"
      >
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          className="searchbar-input"
          onFocus={() => {
            if (results.datasets.length || results.users.length)
              setShowDropdown(true);
          }}
        />
        <button type="submit" className="searchbar-button">
          <FaSearch />
        </button>
      </form>

      {showDropdown && (results.datasets.length > 0 || results.users.length > 0) && (
        <div className="search-results-dropdown">
          {results.datasets.length > 0 && (
            <div className="results-section">
              <div className="section-title">Datasets</div>
              {results.datasets.map((dataset) => (
                <div key={dataset.id} className="result-item">
                  {dataset.title}
                </div>
              ))}
            </div>
          )}
          {results.users.length > 0 && (
            <div className="results-section">
              <div className="section-title">Users</div>
              {results.users.map((user) => (
                <div key={user.username} className="result-item">
                  {user.username}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
