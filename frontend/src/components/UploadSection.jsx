// src/components/UploadSection.jsx
import { useState } from 'react';
import './dashboard.css';

export default function UploadSection({ onUpload }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const dataset = {
      datasetId: Date.now(),
      title,
      description,
      file: selectedFile,
      uploadDate: new Date().toISOString().split('T')[0],
      size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' Mo',
      type: selectedFile.type,
      owner: 'anonymous',
    };

    onUpload(dataset);

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setUploadSuccess(true);

    setTimeout(() => {
      setUploadSuccess(false);
    }, 2000); // Notification disparaît après 2 secondes
  };

  return (
    <section className="upload-section">
      <h2>Upload a Dataset</h2>
      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="text"
          placeholder="Dataset Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Dataset Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload</button>
        {uploadSuccess && (
          <div className="upload-success">Upload Successful ✅</div>
        )}
      </form>
    </section>
  );
}
