import { useState, useEffect, useRef } from 'react';
import './UploadModal.css';
import { FaUpload } from 'react-icons/fa';

export default function UploadModal({ isOpen, onClose}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedFiles.length === 0) {
      setError('Please select at least one file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    selectedFiles.forEach((file) => formData.append('files', file));
    formData.append('token', localStorage.getItem('access_token'));

    try {
      const response = await fetch('http://192.168.64.112/api/upload-dataset/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Dataset uploaded successfully!');
        setTitle('');
        setDescription('');
        setSelectedFiles([]);
        setTimeout(() => onClose(), 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to upload dataset.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleClickDropArea = () => {
    fileInputRef.current.click();
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload a Dataset</h2>
        <form className="upload-form" onSubmit={handleSubmit}>
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

          <div
            className="drop-area"
            onClick={handleClickDropArea}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <p>Click or Drag & Drop files here</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="file-previews">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="file-preview-button removable"
                  title="Click to remove"
                  onClick={() => handleRemoveFile(index)}
                >
                  {file.name}
                </div>
              ))}
            </div>
          )}

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="upload-btn">
              <FaUpload className="upload-icon" />
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
