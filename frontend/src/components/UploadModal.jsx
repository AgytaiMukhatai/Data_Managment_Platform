 import { useState, useEffect } from 'react';
import './UploadModal.css';
import { FaUpload } from 'react-icons/fa';


export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset the error and success messages when the modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
    }
  }, [isOpen]); // This hook runs when 'isOpen' changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Clear previous errors
    setSuccess(''); // Clear previous success messages

    if (selectedFiles.length === 0) {
      setError('Please select at least one file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('token', localStorage.getItem('access_token'))

    try {
      const response = await fetch('http://localhost:8000/api/upload-dataset/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Dataset uploaded successfully!');
        setTitle('');
        setDescription('');
        setSelectedFiles([]);
        setTimeout(() => {onClose();}, 2000);
      } else {
        // If response is not ok, get the error from the backend
        const errorData = await response.json();
        setError(errorData.error || 'Failed to upload dataset.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Something went wrong. Please try again.');
    }
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
          <input
            type="file"
            multiple
            onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="upload-btn">
              <FaUpload style={{ marginRight: '8px' }} />
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
