import { useState } from 'react';
import './dashboard.css';

export default function SearchBar({ onSearch, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilterChange = (e) => {
    const selectedType = e.target.value;
    setFilterType(selectedType);
    onFilterChange(selectedType);
  };

  return (
    <div className="search-filter-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search datasets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="search-btn" onClick={handleSearch}>Search</button>

      <select className="filter-select" value={filterType} onChange={handleFilterChange}>
        <option value="All">All Types</option>
        <option value="Text">Text</option>
        <option value="Image">Image</option>
        <option value="Video">Video</option>
        <option value="Audio">Audio</option>
        <option value="Numerical">Numerical</option>
        <option value="Tabular">Tabular</option>
      </select>
    </div>
  );
}
