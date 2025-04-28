// Dashboard.jsx corrigé et PROPRE
import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import UploadSection from './UploadSection';
import DatasetTable from './DatasetTable';
import SearchBar from './SearchBar';
import DatasetPreview from './DatasetPreview';
import './dashboard.css';

export default function Dashboard() {
  const [allDatasets, setAllDatasets] = useState([]); // Tous les datasets
  const [filteredDatasets, setFilteredDatasets] = useState([]); // Ce qui est affiché
  const [selectedDataset, setSelectedDataset] = useState(null);

  const handleUpload = (dataset) => {
    const newDatasets = [...allDatasets, { ...dataset, datasetId: Date.now() }];
    setAllDatasets(newDatasets);
    setFilteredDatasets(newDatasets);
  };

  const handleDelete = (datasetId) => {
    const updatedDatasets = allDatasets.filter(d => d.datasetId !== datasetId);
    setAllDatasets(updatedDatasets);
    setFilteredDatasets(updatedDatasets);
  };

  const handleDownload = (dataset) => {
    const url = URL.createObjectURL(dataset.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = dataset.title || 'dataset';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFilter = (type) => {
    if (type === 'All') {
      setFilteredDatasets(allDatasets);
    } else {
      const filtered = allDatasets.filter(d => d.type.toLowerCase().includes(type.toLowerCase()));
      setFilteredDatasets(filtered);
    }
  };

  const handleSearch = (query) => {
    const filtered = allDatasets.filter(d =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDatasets(filtered);
  };

  return (
    <div className="dashboard-container">
      <Sidebar onFilter={handleFilter} />
      <main className="main-content">
        <Topbar />

        {/* Recherche + Upload */}
        <div className="search-filter-container">
          <SearchBar onSearch={handleSearch} />
        </div>

        <UploadSection onUpload={handleUpload} />
        <DatasetTable datasets={filteredDatasets} onDelete={handleDelete} onDownload={handleDownload} />
        {selectedDataset && <DatasetPreview dataset={selectedDataset} />}
      </main>
    </div>
  );
}
