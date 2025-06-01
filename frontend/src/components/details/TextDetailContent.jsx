import React, { useState } from "react";
import "./TextDetailContent.css";
import { FaDownload } from "react-icons/fa";
import LikeComponent from "./LikeComponent";

export default function TextDetailContent({ dataset }) {
  const data = dataset;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data.likes);
  const [activeTextIndex, setActiveTextIndex] = useState(0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="tabular-detail-container">
      {/* Header */}
      <div className="tabular-header">
        <div className="tabular-title">
          <h1>{data.title}</h1>
          <LikeComponent
            liked={liked}
            toggleLike={toggleLike}
            likeCount={likeCount}
          />
        </div>
        <span>
          Modality: {data.type} • Uploaded by: {data.uploadedBy} • Date: {data.uploadDate}
        </span>
      </div>

      {/* Body */}
      <div className="tabular-body">
        <div className="tabular-left">

          {/* Overview */}
          <div className="tabular-section overview-box">
            <h3>Overview</h3>
            <p>{data.description}</p>
          </div>

          {/* Sample Preview (texte scrollable verticalement) */}
          <div className="tabular-section sample-box text-mode">
            <h3>Sample Preview</h3>
            <div className="scrollable-text-content">
              <pre>{data.previewTexts[activeTextIndex]}</pre>
            </div>
          </div>

          {/* Download button */}
          <button className="tabular-download-btn">
            <FaDownload style={{ marginRight: "8px" }} /> Download
          </button>
        </div>

        {/* Right Column */}
        <div className="tabular-right">
          <div className="metadata-box1">
            <h4>Metadata</h4>
            <table>
              <tbody>
                <tr>
                  <td style={{ paddingRight: "30px" }}>Number of Files:</td>
                  <td><strong>{data.metadata.numberOfFiles}</strong></td>
                </tr>
                <tr>
                  <td style={{ paddingRight: "30px" }}>Total Size:</td>
                  <td><strong>{data.metadata.totalSize}</strong></td>
                </tr>
                <tr>
                  <td style={{ paddingRight: "30px" }}>Formats:</td>
                  <td><strong>{data.metadata.formats.join(", ")}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="tags-box">
            <h4>Tags</h4>
            <div>
              {data.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="dataexplorer-box">
            <h4>Data Explorer</h4>
            {data.previewTexts.map((_, index) => (
              <button
                key={index}
                className={`explorer-button ${index === activeTextIndex ? "active" : ""}`}
                onClick={() => setActiveTextIndex(index)}
              >
                📄 file {index + 1}
              </button>
            ))}
          </div>

          <div className="downloads-box">
            <div className="download-label">Downloads</div>
            <div className="download-count">{data.downloads}</div>
          </div>
        </div>
      </div>
    </div>
  );
}