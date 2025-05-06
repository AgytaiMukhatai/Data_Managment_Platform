// src/pages/Datasets.jsx
import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import ModalitiesFilter from '../components/ModalitiesFilter';
import SizeSlider from '../components/SizeSlider';
import DatasetList from '../components/DatasetList';
import './datasets.css';

export default function Datasets({ datasets, setDatasets, onOpenUploadModal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState('All');
  const [sizeRange, setSizeRange] = useState(300);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleFilter = (modality) => {
    setSelectedModality(modality);
  };

  const handleSizeChange = (value) => {
    setSizeRange(value);
  };

  const handleDownload = (dataset) => {
    const url = URL.createObjectURL(dataset.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = dataset.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      <div className="datasets-header">
        <SearchBar
          onSearch={handleSearch}
          onOpenUploadModal={onOpenUploadModal}
        />
        <FilterDropdown onFilter={handleFilter} />
      </div>

      <div className="filter-row">
        <div className="modalities-column">
          <ModalitiesFilter onModalitySelect={handleFilter} />
        </div>
        <div className="size-column">
          <SizeSlider onChange={handleSizeChange} value={sizeRange} />
        </div>
      </div>

      <DatasetList datasets={filteredDatasets} onDownload={handleDownload} />
    </div>
  );
}
