// src/components/ModalitiesFilter.jsx
import './dashboard.css'; // Notre CSS principal

export default function ModalitiesFilter({ onModalitySelect }) {
  const modalities = [
    { label: "3D", value: "3d" },
    { label: "Image", value: "image" },
    { label: "Text", value: "text" },
    { label: "Tabular", value: "tabular" },
    { label: "Video", value: "video" },
    { label: "Audio", value: "audio" },
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
            {modality.label}
          </button>
        ))}
      </div>
    </div>
  );
}
