import React, { useState } from "react";
import "./AudioDetailContent.css";
import { FaDownload, FaPlayCircle } from "react-icons/fa";
import { MdGraphicEq } from "react-icons/md";
import LikeComponent from "./LikeComponent";

export default function AudioDetailContent({ dataset }) {
  const data = dataset;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data.likes);

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

          {/* Sample Preview */}
          <div className="tabular-section sample-box">
            <h3>Sample Preview</h3>
            <div className="media-preview-grid">
              {data.previewMedia.map((item, index) => (
                item.type === "audio" && (
                  <div className="media-card horizontal" key={index}>
                    <div className="audio-info-with-icon">
                      <div className="audio-icons">
                        <FaPlayCircle className="play-icon" />
                        <MdGraphicEq className="eq-icon" />
                      </div>
                      <div className="audio-info">
                        <div className="media-name">{item.name}</div>
                        <span className="media-duration">{item.duration}</span>
                      </div>
                    </div>
                    <audio controls className="media-player">
                      <source src={item.url} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Download Button */}
          <button className="tabular-download-btn">
            <FaDownload style={{ marginRight: "8px" }} /> Download
          </button>
        </div>

        {/* Right column */}
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
                  <td><strong>{data.size}</strong></td>
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

          <div className="downloads-box">
            <div className="download-label">Downloads</div>
            <div className="download-count">{data.downloads}</div>
          </div>
        </div>
      </div>
    </div>
  );
}