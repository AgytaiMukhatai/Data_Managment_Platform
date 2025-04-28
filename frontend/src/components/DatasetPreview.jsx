// src/components/DatasetPreview.jsx
import { useState } from 'react';
import './dashboard.css';

export default function DatasetPreview({ dataset }) {
  const [previewData, setPreviewData] = useState(null);

  const handlePreview = () => {
    if (!dataset) return;

    const reader = new FileReader();

    if (dataset.type.startsWith('image/')) {
      // Si c'est une image
      reader.onload = (e) => {
        setPreviewData(
          <img src={e.target.result} alt="Preview" className="preview-image" />
        );
      };
      reader.readAsDataURL(dataset.file);
    } else if (dataset.type === 'text/csv' || dataset.type.includes('text')) {
      // Si c'est un CSV ou un fichier texte
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').slice(0, 5); // Affiche juste les 5 premières lignes
        setPreviewData(
          <div className="preview-csv">
            {rows.map((row, idx) => (
              <div key={idx}>{row}</div>
            ))}
          </div>
        );
      };
      reader.readAsText(dataset.file);
    } else {
      setPreviewData(
        <div style={{ marginTop: '20px', color: '#999' }}>
          No preview available for this file type.
        </div>
      );
    }
  };

  if (!dataset) {
    return null;
  }

  return (
    <section className="preview-section">
      <h2>Dataset Preview</h2>
      <button onClick={handlePreview} className="preview-btn">
        Preview Dataset
      </button>
      <div className="preview-content">
        {previewData}
      </div>
    </section>
  );
}
