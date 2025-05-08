// src/components/UploadModal.jsx
import { useState } from 'react';
import './dashboard.css';

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    const newDataset = {
      datasetId: Date.now(),
      title,
      description,
      file: selectedFile,
      uploadDate: new Date().toISOString().split('T')[0],
      size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
      type: selectedFile.type,
      owner: 'anonymous', // Can be replaced later with logged-in user
    };

    onUpload(newDataset);
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload a Dataset</h2>
        <form onSubmit={handleSubmit} className="upload-form">
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
            onChange={(e) => setSelectedFile(e.target.files[0])}
            required
          />
          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="upload-btn">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}
