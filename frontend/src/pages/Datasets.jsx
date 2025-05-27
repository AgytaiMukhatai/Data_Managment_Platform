// src/pages/Datasets.jsx
import { useState } from 'react';
import FilterDropdown from '../components/FilterDropdown';
import ModalitiesFilter from '../components/ModalitiesFilter';
import SizeSlider from '../components/SizeSlider';
import DatasetList from '../components/DatasetList';
import { FaUpload } from 'react-icons/fa';
import './datasets.css';

export default function Datasets({ datasets, onOpenUploadModal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState('All');
  const [sizeRange, setSizeRange] = useState(300);

  const handleFilter = (modality) => {
    setSelectedModality(modality);
  };

  const handleSizeChange = (value) => {
    setSizeRange(value);
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchQuery);
    const matchesModality =
      selectedModality === 'All' ||
      dataset.type.toLowerCase().includes(selectedModality.toLowerCase());
    const matchesSize = parseFloat(dataset.size) <= sizeRange;
    return matchesSearch && matchesModality && matchesSize;
  });

  return (
    <div className="datasets-page">
      <div className="datasets-top-section">
        <div className="left-section">
          <ModalitiesFilter onModalitySelect={handleFilter} />
        </div>
        <div className="right-section">
          <SizeSlider onChange={handleSizeChange} value={sizeRange} />
          <div className="upload-filter-row">
            <button className="upload-btn" onClick={onOpenUploadModal}>
              <FaUpload style={{ marginRight: '8px' }} />
              Upload
            </button>
            <FilterDropdown onFilterChange={handleFilter} />
          </div>
        </div>
      </div>

      <DatasetList datasets={filteredDatasets} />
    </div>
  );
}
