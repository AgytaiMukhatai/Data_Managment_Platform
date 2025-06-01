import { useState, useEffect } from "react";
import FilterDropdown from "../components/FilterDropdown";
import ModalitiesFilter from "../components/ModalitiesFilter";
import SizeSlider from "../components/SizeSlider";
import DatasetList from "../components/DatasetList";
import { FaUpload } from "react-icons/fa";
import "./datasets.css";
import UploadModal from "../components/UploadModal";
import Topbar from "../components/Topbar";

export default function Datasets() {
  const [selectedModality, setSelectedModality] = useState("All");
  const [sizeRange, setSizeRange] = useState(300);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchDatasets = () => {
      fetch("http://localhost:8000/api/datasets/")
        .then((res) => res.json())
        .then((data) => setDatasets(data))
        .catch((err) => console.error("Failed to fetch datasets:", err));
    };

    fetchDatasets();
    const interval = setInterval(fetchDatasets, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFilter = (modality) => {
    setSelectedModality(modality);
  };

  const handleSizeChange = (value) => {
    setSizeRange(value);
  };

  const handleSortChange = (sort) => {
    setSortOption(sort);
  };

  const handleUpload = () => {
    setIsUploadOpen(false);
  };

  const filteredDatasets = datasets
    .filter((dataset) => {
      const matchesModality =
        selectedModality === "All" ||
        dataset.dataset_type.toLowerCase() === selectedModality.toLowerCase();
      const matchesSize = parseFloat(dataset.size) <= sizeRange;
      return matchesModality && matchesSize;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "most_downloaded":
          return b.downloads - a.downloads;
        case "recently_created":
          return new Date(b.created_at) - new Date(a.created_at);
        case "most_viewed":
          return b.views - a.views;
        case "most_liked":
          return b.likes - a.likes;
        case "smallest_size":
          return a.size - b.size;
        case "largest_size":
          return b.size - a.size;
        default:
          return 0;
      }
    });

  return (
    <div className="datasets-page">
      <Topbar />
      <div className="datasets-top-section">
        <div className="left-section">
          <ModalitiesFilter onModalitySelect={handleFilter} />
        </div>
        <div className="right-section">
          <SizeSlider onSizeChange={handleSizeChange} value={sizeRange} />
          <div className="upload-filter-row">
            <button className="upload-btn" onClick={() => setIsUploadOpen(true)}>
              <FaUpload className="upload-icon" />
              Upload
            </button>
            <FilterDropdown onFilterChange={handleSortChange} />
          </div>
        </div>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />

      <DatasetList datasets={filteredDatasets} />
    </div>
  );
}