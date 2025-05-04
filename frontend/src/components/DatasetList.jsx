// src/components/DatasetList.jsx
import './dashboard.css';

export default function DatasetList({ datasets, onDownload }) {
  return (
    <section className="dataset-list-section">
      <h2>Datasets</h2>
      <div className="dataset-list">
        {datasets.length === 0 ? (
          <p>No datasets uploaded yet.</p>
        ) : (
          datasets.map((dataset) => (
            <div key={dataset.datasetId} className="dataset-card">
              <div className="dataset-info">
                <h3>{dataset.title}</h3>
                <p>{dataset.description}</p>
                <div className="dataset-meta">
                  <span><strong>Size:</strong> {dataset.size}</span>
                  <span><strong>Type:</strong> {dataset.type}</span>
                  <span><strong>Owner:</strong> {dataset.owner}</span>
                  <span><strong>Uploaded:</strong> {dataset.uploadDate}</span>
                </div>
              </div>
              <div className="dataset-actions">
                <button onClick={() => onDownload(dataset)} className="download-btn">Download</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
