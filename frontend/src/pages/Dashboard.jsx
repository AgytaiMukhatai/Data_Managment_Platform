// src/pages/Dashboard.jsx
// import { useLocation } from 'react-router-dom';
import { useState } from "react";
import Topbar from "../components/Topbar";
import Datasets from "./Datasets";
import Profile from "./Profile";
import UploadModal from "../components/UploadModal";
import "./Dashboard.css";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("datasets");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [datasets, setDatasets] = useState([]);

  const handleUpload = (newDataset) => {
    console.log("Uploaded dataset:", newDataset);
    fetchDatasets(); // si tu as une fonction de chargement
    setIsUploadOpen(false);
  };

  const renderContent = () => {
    switch (activePage) {
      case "datasets":
        return (
          <Datasets
            datasets={datasets}
            onOpenUploadModal={() => setIsUploadOpen(true)}
          />
        );
      case "profile":
        return <Profile />;
      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className="dashboard-page">
      <Topbar
        setActivePage={setActivePage}
        activePage={activePage}
        onOpenUploadModal={() => setIsUploadOpen(true)}
      />

      <div className="dashboard-content">{renderContent()}</div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
