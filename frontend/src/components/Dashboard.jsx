// src/components/Dashboard.jsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import UploadModal from './UploadModal';
import Datasets from '../pages/Datasets';
import Profile from '../pages/Profile';
import Models from '../pages/Models';
import './dashboard.css';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('datasets');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpload = (newDataset) => {
    setDatasets(prev => [...prev, { ...newDataset, datasetId: Date.now() }]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // log or filter action
  };

  const renderContent = () => {
    switch (activePage) {
      case 'datasets':
        return <Datasets datasets={datasets} setDatasets={setDatasets} />;
      case 'profile':
        return <Profile datasets={datasets} setDatasets={setDatasets} />;
      case 'models':
        return <Models />;
      default:
        return <Datasets datasets={datasets} setDatasets={setDatasets} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-section">
        <Topbar
          onOpenUploadModal={() => setIsUploadOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />
        <div className="content-section">{renderContent()}</div>
        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
}
