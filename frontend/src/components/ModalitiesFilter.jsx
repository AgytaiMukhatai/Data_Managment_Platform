// src/components/ModalitiesFilter.jsx
import './ModalitiesFilter.css';
import { FaImage, FaPlay, FaVolumeUp, FaTable, FaAlignLeft, FaFileAlt } from 'react-icons/fa';

export default function ModalitiesFilter({ onModalitySelect }) {
  const modalities = [
    { label: "Text", value: "text", icon: <FaAlignLeft /> },
    { label: "Image", value: "image", icon: <FaImage /> },
    { label: "Video", value: "video", icon: <FaPlay /> },
    { label: "Audio", value: "audio", icon: <FaVolumeUp /> },
    { label: "Tabular", value: "tabular", icon: <FaTable /> },
    { label: "All", value: "all", icon: <FaFileAlt /> },
  ];

  return (
    <div className="modalities-container">
      <h3>Modalities</h3>
      <div className="modalities-grid">
        {modalities.map((modality, index) => (
          <button
            key={index}
            className="modality-button"
            onClick={() => onModalitySelect(modality.value)}
          >
            <span className="modality-icon">{modality.icon}</span>
            {modality.label}
          </button>
        ))}
      </div>
    </div>
  );
}
