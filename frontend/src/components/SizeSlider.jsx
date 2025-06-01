// src/components/SizeSlider.jsx
import { useState } from 'react';
import './SizeSlider.css'; // Utilisation du CSS global

export default function SizeSlider({ onSizeChange }) {
  const [size, setSize] = useState(300); // valeur par défaut maximum (300 Mo)

  const handleChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setSize(newSize);
    onSizeChange(newSize);
  };

  return (
    <div className="size-slider-container">
      <label htmlFor="size-slider">Filter by Size (Max {size} MB)</label>
     <input
  type="range"
  id="size-slider"
  min="0"
  max="300"
  step="1"
  value={size}
  onChange={handleChange}
  style={{background: `linear-gradient(to right, #3182B8 0%, #3182B8 ${size / 3}%, #ccc ${size / 3}%, #ccc 100%)`}}
  />
    </div>
  );
  }
