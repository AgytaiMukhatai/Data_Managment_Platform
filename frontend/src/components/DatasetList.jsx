import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import './dashboard.css';

export default function DatasetList() {
  const { user, setUser } = useContext(UserContext);
  const [liked, setLiked] = useState(() =>
    (user.likedDatasets || []).reduce((acc, ds) => {
      acc[ds.datasetId] = true;
      return acc;
    }, {})
  );

  const [datasetList, setDatasetList] = useState([]);
  const fetchDatasets = () => {
    fetch('http://localhost:8000/api/datasets/')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched datasets:', data);
        setDatasetList(data);
      })
      .catch((error) => {
        console.error('Error fetching datasets:', error);
      });
  };

  // Poll datasets every 3 seconds
  useEffect(() => {
    fetchDatasets();
    const interval = setInterval(() => {
      fetchDatasets();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const onDownload= async (dataset) => {
    try {
      const response = await fetch(`http://localhost:8000/api/download-dataset/${encodeURIComponent(dataset.title)}/`, {
        method: 'GET'
      });
  
      if (!response.ok) {
        throw new Error('Failed to download dataset');
      }
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = `${dataset.title}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading dataset');
    }
  };
  

  const toggleLike = (dataset) => {
    const isLiked = liked[dataset.datasetId];

    setLiked((prev) => ({
      ...prev,
      [dataset.datasetId]: !isLiked,
    }));

    const updatedLikes = isLiked
      ? user.likedDatasets.filter((ds) => ds.datasetId !== dataset.datasetId)
      : [...(user.likedDatasets || []), dataset];

    setUser({ ...user, likedDatasets: updatedLikes });
  };

  return (
    <section className="dataset-list-section">
      <h2>Datasets</h2>
      <div className="dataset-list">
        {datasetList.length === 0 ? (
          <p>No datasets uploaded yet.</p>
        ) : (
          datasetList.map((dataset) => (
            <div key={dataset.datasetId} className="dataset-card">
              <div className="dataset-info">
                <h3>{dataset.title}</h3>
                <p>{dataset.description}</p>
                <div className="dataset-meta">
                  <span><strong>Type:</strong> {dataset.dataset_type}</span>
                  <span><strong>Size:</strong> {dataset.size} MB</span>
                  <span><strong>Uploaded:</strong> {new Date(dataset.upload_date).toLocaleDateString()}</span>
                  <span><strong>Views:</strong> {dataset.views}</span>
                  <span><strong>Likes:</strong> {dataset.likes}</span>
                </div>
              </div>
              <div className="dataset-actions">
                <button onClick={() => onDownload(dataset)} className="download-btn">
                  Download
                </button>
                <button
                  className={`like-btn ${liked[dataset.datasetId] ? 'liked' : ''}`}
                  onClick={() => toggleLike(dataset)}
                >
                  {liked[dataset.datasetId] ? '♥ Liked' : '♡ Like'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
