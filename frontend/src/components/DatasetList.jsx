// src/components/DatasetList.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaImage, FaAlignLeft, FaVolumeUp, FaPlayCircle, FaTable, FaHeart, FaDownload, FaEye }
from "react-icons/fa";
import "./DatasetList.css";
// 🔒 API setup (commenté pour design statique)
// const [datasetList, setDatasetList] = useState([]);
// const fetchDatasets = () => {
//   fetch('http://localhost:8000/api/datasets/')
//     .then((response) => response.json())
//     .then((data) => setDatasetList(data))
//     .catch((error) => console.error('Error fetching datasets:', error));
// };

// useEffect(() => {
//   fetchDatasets();
//   const interval = setInterval(() => fetchDatasets(), 3000);
//   return () => clearInterval(interval);
// }, []);

export default function DatasetList() {
  // const navigate = useNavigate();
  const [liked, setLiked] = useState({});
  
  const staticDatasets = [
    {
      datasetId: '1',
      title: 'Customer Reviews',
      type: 'text',
      uploadedBy: 'UserX',
      uploadDate: '2024-12-17',
      size: '328 MB',
      likes: 35,
      downloads: 122,
      views: 300, 
      description: 'Lorem ipsum dolor sit amet...',
      tags: ['#Tag', '#Another Tag'],
      metadata: {
        numberOfFiles: 123,
        formats: ['txt', 'doc']
      }
    },
    {
      datasetId: '2',
      title: 'Product Images Set',
      type: 'image',
      uploadedBy: 'UserY',
      uploadDate: '2024-12-17',
      size: '342 MB',
      likes: 45,
      downloads: 321,
      views: 130, 
      description: 'This is an image dataset...',
      tags: ['#Image', '#Photos'],
      metadata: {
        numberOfFiles: 230,
        formats: ['jpeg', 'png']
      }
    },
    {
      datasetId: '3',
      title: 'Podcast Episode Audio',
      type: 'audio',
      uploadedBy: 'UserA',
      uploadDate: '2025-06-17',
      size: '389 MB',
      likes: 93,
      downloads: 62,
      views: 49, 
      description: 'Podcast and audio clips.',
      tags: ['#Podcast', '#Talk'],
      metadata: {
        numberOfFiles: 230,
        formats: ['mp3', 'wav']
      }
    },
    {
      datasetId: '4',
      title: 'Survey Results',
      type: 'tabular',
      uploadedBy: 'UserB',
      uploadDate: '2023-11-01',
      size: '124 MB',
      likes: 87,
      downloads: 400,
      views: 80, 
      description: 'Survey data with charts.',
      tags: ['#Survey', '#CSV'],
      metadata: {
        numberOfFiles: 2,
        formats: ['csv']
      }
    }
  ];

  const toggleLike = (datasetId) => {
    setLiked((prev) => ({
      ...prev,
      [datasetId]: !prev[datasetId],
    }));
  };

  const getIcon = (type) => {
    switch (type) {
      case "text":
        return <FaAlignLeft />;
      case "image":
        return <FaImage />;
      case "audio":
        return <FaVolumeUp />;
      case "video":
        return <FaPlayCircle />;
      case "tabular":
        return <FaTable />;
      default:
        return null;
    }
  };

  return (
    <section className="dataset-list-section">
      <h2>Datasets</h2>
      <div className="dataset-list">
        {staticDatasets.map((ds) => (
          <Link
            to={"/detailpages/" + ds.datasetId}
            key={ds.datasetId}
            className="dataset-card"
            style={{ cursor: "pointer", textDecoration: "none" }}
          >
            <div className="dataset-row">
              <div className="dataset-title-icon">
                {getIcon(ds.type)}
                <h3 className="dataset-title">{ds.title}</h3>
              </div>
              <div className="dataset-meta">
                <span>{ds.size}</span>
                <span>
                  Uploaded {new Date(ds.uploadDate).toLocaleDateString()}
                </span>
                <span
                  className="icon-meta"
                  onClick={() => toggleLike(ds.datasetId)}
                >
                  <FaHeart className={liked[ds.datasetId] ? "liked" : ""} />{" "}
                  {ds.likes + (liked[ds.datasetId] ? 1 : 0)}
                </span>
                <span className="icon-meta">
                  <FaDownload /> {ds.downloads}
                </span>
                <span className="icon-meta">
                  <FaEye /> {ds.views}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
