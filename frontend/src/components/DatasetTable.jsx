import './dashboard.css';

export default function DatasetTable({ datasets, onDelete, onDownload }) {
  const handleConfirmDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this dataset?");
    if (confirmDelete) {
      onDelete(id);
    }
  };

  return (
    <section className="dataset-section">
      <h2>My Datasets</h2>
      <table className="dataset-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Upload Date</th>
            <th>Size</th>
            <th>Type</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {datasets.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                No datasets uploaded yet.
              </td>
            </tr>
          ) : (
            datasets.map((dataset) => (
              <tr key={dataset.datasetId}>
                <td>{dataset.title}</td>
                <td>{dataset.description}</td>
                <td>{dataset.uploadDate}</td>
                <td>{dataset.size}</td>
                <td>{dataset.type}</td>
                <td>{dataset.owner}</td>
                <td>
                  <button onClick={() => onDownload(dataset)}>Download</button>
                  <button className="delete-btn" onClick={() => handleConfirmDelete(dataset.datasetId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
