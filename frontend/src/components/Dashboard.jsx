// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import UploadModal from './UploadModal';
import Datasets from '../pages/Datasets';
import './dashboard.css';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('datasets');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [datasets, setDatasets] = useState([]);
  // Handle dataset upload
  const handleUpload = (newDataset) => {
    console.log('Uploaded dataset:', newDataset);

    // After uploading a new dataset, refetch the datasets from the backend
    fetchDatasets(); // Ensure the list is updated with the newly uploaded dataset
    setIsUploadOpen(false); // Close the modal after upload
  };

  // Render content based on activePage
  const renderContent = () => {
    switch (activePage) {
      case 'datasets':
        return (
          <Datasets
            datasets={datasets}  // Pass datasets directly from the state
            onOpenUploadModal={() => setIsUploadOpen(true)} // Opens the upload modal
          />
        );
      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} /> {/* Sidebar for navigation */}

      <div className="main-section">
        <div className="content-section">
          {renderContent()} {/* Render datasets page based on activePage */}
        </div>

        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)} // Close the modal
          onUpload={handleUpload} // Handle the upload of datasets
        />
      </div>
    </div>
  );
}
