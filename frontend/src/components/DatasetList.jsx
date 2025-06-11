import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaImage,
  FaAlignLeft,
  FaVolumeUp,
  FaPlayCircle,
  FaTable,
  FaHeart,
  FaDownload,
  FaEye
} from "react-icons/fa";
import moment from 'moment';
import "./DatasetList.css";

export default function DatasetList({ datasets }) {
  const [liked, setLiked] = useState({});

  const toggleLike = (datasetId) => {
    setLiked((prev) => ({
      ...prev,
      [datasetId]: !prev[datasetId],
    }));
  };

  const getIcon = (type) => {
    switch (type) {
      case "Text":
        return <FaAlignLeft />;
      case "Image":
        return <FaImage />;
      case "Audio":
        return <FaVolumeUp />;
      case "Video":
        return <FaPlayCircle />;
      case "Tabular":
        return <FaTable />;
      default:
        return null;
    }
  };

  return (
    <section className="dataset-list-section">
      <h2>Datasets</h2>
      <div className="dataset-list">
        {datasets.map((ds) => (
          <Link
            to={`/detailpages/${ds.id || ds.datasetId}`}
            key={ds.id || ds.datasetId}
            className="dataset-card"
            style={{ cursor: "pointer", textDecoration: "none" }}
          >
            <div className="dataset-row">
              <div className="dataset-title-icon">
                {getIcon(ds.dataset_type || ds.type)}
                <h3 className="dataset-title">{ds.title}</h3>
              </div>
              <div className="dataset-meta">
                <span>{ds.size} MB</span>
                <span>
                  Uploaded: {moment(ds.created_at || ds.uploadDate).format('MMM DD, YYYY')}
                </span>
                <span
                  className="icon-meta"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleLike(ds.id || ds.datasetId);
                  }}
                >
                  <FaHeart className={liked[ds.id || ds.datasetId] ? "liked" : ""} />
                  {ds.likes + (liked[ds.id || ds.datasetId] ? 1 : 0)}
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