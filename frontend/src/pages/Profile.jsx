import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import './profile.css';
import defaultAvatar from '/Images/user (1).png';

export default function Profile({ datasets, setDatasets }) {
  const { user, setUser } = useContext(UserContext);

  const [localUser, setLocalUser] = useState(user);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedUser = { ...localUser, profilePic: reader.result };
        setLocalUser(updatedUser);
        setUser(updatedUser);  // Mise à jour globale
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedUser = { ...localUser, [name]: value };
    setLocalUser(updatedUser);
  };

  const handleSave = () => {
    setUser(localUser); // Appliquer les changements globalement
    alert('Profile updated successfully!');
  };

  const handleDownload = (dataset) => {
    const url = URL.createObjectURL(dataset.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = dataset.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (datasetId) => {
    const confirm = window.confirm('Are you sure you want to delete this dataset?');
    if (confirm) {
      const updated = datasets.filter(ds => ds.datasetId !== datasetId);
      setDatasets(updated);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-left">
          <img
            src={localUser.profilePic || defaultAvatar}
            alt="Profile"
            className="profile-avatar"
          />
          <h3>{localUser.name}</h3>
          <p className="user-role">User</p>
          <p className="user-location">{localUser.address || 'Your location'}</p>
        </div>

        <div className="profile-right">
          <div className="info-row"><strong>Full Name:</strong> {localUser.name}</div>
          <div className="info-row"><strong>Nickname:</strong> {localUser.username}</div>
          <div className="info-row"><strong>Email:</strong> {localUser.email}</div>
          <div className="info-row"><strong>Password:</strong> ••••••••</div>
          <div className="info-row"><strong>Address:</strong> {localUser.address || 'Not specified'}</div>
          <button className="edit-icon" onClick={() => alert('Edit mode coming soon')}>Edit</button>
        </div>
      </div>
      <div className="profile-dataset-table">
        <h3>Uploaded Datasets</h3>
        {datasets.length === 0 ? (
          <p>No datasets uploaded.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Size</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map(ds => (
                <tr key={ds.datasetId}>
                  <td>{ds.title}</td>
                  <td>{ds.description}</td>
                  <td>{ds.size}</td>
                  <td>{ds.type}</td>
                  <td>{ds.owner}</td>
                  <td>{ds.uploadDate}</td>
                  <td>
                    <div className="action-icons">
                      <button onClick={() => handleDownload(ds)} className="icon-btn">
                        <img src="/Images/dowload (1).png" alt="Download" className="action-icon" />
                      </button>
                      <button onClick={() => handleDelete(ds.datasetId)} className="icon-btn">
                        <img src="/Images/delete.png" alt="Delete" className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="profile-dataset-table">
        <h3>Liked Datasets</h3>
        {localUser.likedDatasets && localUser.likedDatasets.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Size</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {localUser.likedDatasets.map(ds => (
                <tr key={ds.datasetId}>
                  <td>{ds.title}</td>
                  <td>{ds.description}</td>
                  <td>{ds.size}</td>
                  <td>{ds.type}</td>
                  <td>{ds.owner}</td>
                  <td>{ds.uploadDate}</td>
                  <td>
                    <button className="download-btn" onClick={() => handleDownload(ds)}><img src="/Images/dowload (1).png" alt="Download" className="action-icon"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No liked datasets.</p>
        )}
      </div>
    </div>
  );
}
