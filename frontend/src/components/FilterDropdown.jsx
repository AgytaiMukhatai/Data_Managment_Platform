// src/components/FilterDropdown.jsx
import { useState } from 'react';
import './FilterDropdown.css';


export default function FilterDropdown({ onFilterChange }) {
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    onFilterChange(value); // Remonte la valeur au parent
  };

  return (
    <div className="filter-dropdown-container">
      <select value={selectedFilter} onChange={handleChange} className="filter-dropdown-select">
        <option value="">Sort by...</option>
        <option value="most_downloaded">Most Downloaded</option>
        <option value="recently_created">Recently Created</option>
        <option value="most_used">Most Used</option>
        <option value="smallest_size">Smallest Size</option>
        <option value="largest_size">Largest Size</option>
      </select>
    </div>
  );
}
