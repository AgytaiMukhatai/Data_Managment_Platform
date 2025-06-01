import React, { useState } from "react";
import "./TabularDetailContent.css";
import { FaDownload } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import LikeComponent from "./LikeComponent";

export default function TabularDetailContent({ dataset }) {
  const data = dataset;

  // Sécurité : vérifier que les données sont valides
  const isDataValid =
    data &&
    data.previewTables &&
    data.previewTables.length > 0 &&
    data.previewTables[0].columns &&
    data.previewTables[0].rows;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data?.likes || 0);
  const [activeTableIndex, setActiveTableIndex] = useState(0);

  if (!isDataValid || !data.previewTables[activeTableIndex]) {
    return <div className="error-message">Dataset incomplete or invalid.</div>;
  }

  const activeTable = data.previewTables[activeTableIndex];

  // ✅ Pie Chart basé sur dataset.completeness
  const pieData = dataset.completeness
    ? [
        { name: "Filled", value: dataset.completeness.filled || 0 },
        { name: "Missing", value: dataset.completeness.missing || 0 },
      ]
    : [
        { name: "Filled", value: 0 },
        { name: "Missing", value: 0 },
      ];

  const barData = data?.tableInfo?.structure || [];

  const COLORS = ["#3498db", "#e74c3c"];

  const toggleLike = () => {
    console.log("Toggle like", liked);
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="tabular-detail-container">
      <div className="tabular-header">
        <div className="tabular-title">
          <h1>{data.title}</h1>
          <div>
            <LikeComponent
              liked={liked}
              toggleLike={toggleLike}
              likeCount={likeCount}
            />
          </div>
        </div>
        <span>
          Modality: {data.type} • Uploaded by: {data.uploadedBy} • Date:{" "}
          {data.uploadDate}
        </span>
      </div>

      <div className="tabular-body">
        <div className="tabular-left">
          <div className="tabular-section overview-box">
            <h3>Overview</h3>
            <p>{data.description}</p>
          </div>

          <div className="tabular-section sample-box">
            <h3>Sample Preview</h3>
            <div className="table-preview">
              <table>
                <thead>
                  <tr>
                    {activeTable.columns.map((col, i) => (
                      <th key={i}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeTable.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tabular-section visualization-section">
            <h3>Visualization</h3>
            <div className="visualization-content">
              <div className="visualization-box">
                <ResponsiveContainer width={200} height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      labelLine={false}
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius =
                          innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={14}
                            fontWeight="bold"
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                      isAnimationActive={true}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" iconType="circle" />{" "}
                    {/* ✅ Voici la légende automatique en bas */}
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="visualization-box">
                <ResponsiveContainer width={300} height={200}>
                  <BarChart data={barData}>
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#3498db"
                      name="Number of Columns"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <button className="tabular-download-btn">
            <FaDownload style={{ marginRight: "8px" }} /> Download
          </button>
        </div>

        <div className="tabular-right">
          <div className="metadata-box1">
            <h4>Metadata</h4>
            <table>
              <tbody>
                <tr>
                  <td style={{ paddingRight: "30px" }}>Number of Files:</td>
                  <td>
                    <strong>{data.metadata.numberOfFiles}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: "30px" }}>Total Size:</td>
                  <td>
                    <strong>{data.metadata.totalSize}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: "30px" }}>Formats:</td>
                  <td>
                    <strong>{data.metadata.formats.join(", ")}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="tags-box">
            <h4>Tags</h4>
            <div>
              {data.tags.map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="dataexplorer-box">
            <h4>Data Explorer</h4>
            {data.previewTables.map((table, index) => (
              <button
                key={index}
                className={`explorer-button ${
                  index === activeTableIndex ? "active" : ""
                }`}
                onClick={() => setActiveTableIndex(index)}
              >
                📄 file {index + 1}
              </button>
            ))}
          </div>

          <div className="metadata-box2">
            <h4>Table Info</h4>
            <table>
              <tbody>
                <tr>
                  <td style={{ paddingRight: "30px" }}>Columns:</td>
                  <td>
                    <strong>{data.tableInfo.columns}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: "30px" }}>Rows:</td>
                  <td>
                    <strong>{data.tableInfo.rows}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: "30px" }}>Size:</td>
                  <td>
                    <strong>{data.tableInfo.size}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: "30px" }}>Format:</td>
                  <td>
                    <strong>{data.tableInfo.format}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="downloads-box">
            <div className="download-label">Download</div>
            <div className="download-count">{data.downloads}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
