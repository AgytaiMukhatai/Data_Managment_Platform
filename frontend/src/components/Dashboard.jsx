// src/components/Dashboard.jsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import UploadModal from './UploadModal';
import Datasets from '../pages/Datasets';
import Profile from '../pages/Profile';
import './dashboard.css';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('datasets');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [datasets, setDatasets] = useState([]);

  const handleUpload = (newDataset) => {
    setDatasets(prev => [...prev, { ...newDataset, datasetId: Date.now() }]);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'datasets':
        return (
          <Datasets
            datasets={datasets}
            setDatasets={setDatasets}
            onOpenUploadModal={() => setIsUploadOpen(true)}
          />
        );
      case 'profile':
        return (
          <Profile
            datasets={datasets}
            setDatasets={setDatasets}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-section">
        <div className="content-section">
          {renderContent()}
        </div>
        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
}
