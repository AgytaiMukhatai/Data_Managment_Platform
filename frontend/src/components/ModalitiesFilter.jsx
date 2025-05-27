// src/components/ModalitiesFilter.jsx
import './ModalitiesFilter.css';
import { FaRegFileAlt, FaImage, FaPlay, FaVolumeUp, FaTable } from 'react-icons/fa';

export default function ModalitiesFilter({ onModalitySelect }) {
  const modalities = [
    { label: "Text", value: "text", icon: <FaRegFileAlt /> },
    { label: "Image", value: "image", icon: <FaImage /> },
    { label: "Video", value: "video", icon: <FaPlay /> },
    { label: "Audio", value: "audio", icon: <FaVolumeUp /> },
    { label: "Tabular", value: "tabular", icon: <FaTable /> },
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
