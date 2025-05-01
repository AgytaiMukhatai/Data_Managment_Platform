// src/pages/Datasets.jsx
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import ModalitiesFilter from '../components/ModalitiesFilter';
import SizeSlider from '../components/SizeSlider';
import DatasetList from '../components/DatasetList';
import UploadModal from '../components/UploadModal';
import { useState } from 'react';
import './datasets.css';

export default function Datasets() {
  const [datasets, setDatasets] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState('All');
  const [sizeRange, setSizeRange] = useState(300);

  const handleUpload = (dataset) => {
    setDatasets(prev => [...prev, { ...dataset, datasetId: Date.now() }]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleFilter = (modality) => {
    setSelectedModality(modality);
  };

  const handleSizeChange = (value) => {
    setSizeRange(value);
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchQuery);
    const matchesModality = selectedModality === 'All' || dataset.type.toLowerCase().includes(selectedModality.toLowerCase());
    const matchesSize = parseFloat(dataset.size) <= sizeRange;
    return matchesSearch && matchesModality && matchesSize;
  });

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

  return (
    <div className="datasets-page">
      <div className="datasets-header">
        <SearchBar onSearch={handleSearch} />
        {/* <button className="upload-btn" onClick={() => setShowUpload(true)}>Upload</button> */}
        <FilterDropdown onFilter={handleFilter} />
      </div>

      <ModalitiesFilter onFilter={handleFilter} />
      <SizeSlider onChange={handleSizeChange} value={sizeRange} />

      <DatasetList datasets={filteredDatasets} onDownload={handleDownload} />

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />}
    </div>
  );
}
