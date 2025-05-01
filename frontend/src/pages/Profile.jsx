import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import './profile.css';
import defaultAvatar from '/Images/userImage.jpeg';

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
      <h2>My Profile</h2>

      <div className="profile-top">
        <img
          src={localUser.profilePic || defaultAvatar}
          alt="Profile"
          className="profile-avatar"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="profile-info">
        <input name="name" value={localUser.name} onChange={handleChange} placeholder="Full name" />
        <input name="username" value={localUser.username} onChange={handleChange} placeholder="Username" />
        <input name="email" value={localUser.email} onChange={handleChange} placeholder="Email" />
        <input name="password" type="password" value={localUser.password} onChange={handleChange} placeholder="Password" />
        <button onClick={handleSave}>Save Changes</button>
      </div>

      <div className="profile-dataset-table">
        <h3>My Uploaded Datasets</h3>
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
                    <button className="download-btn" onClick={() => handleDownload(ds)}>Download</button>
                    <button className="delete-btn" onClick={() => handleDelete(ds.datasetId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
