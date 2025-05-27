// src/pages/Profile.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './profile.css'
import defaultAvatar from '/Images/user (1).png'


export default function Profile() {
	const navigate = useNavigate()
	const [localUser, setLocalUser] = useState({
		name: 'Max Musterman',
		username: 'musterman',
		email: 'muster@gmail.com',
		address: 'Berlin, Germany',
		profilePic: null,
	})

	const handleFileChange = e => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				setLocalUser({ ...localUser, profilePic: reader.result })
			}
			reader.readAsDataURL(file)
		}
	}

	const handleChange = e => {
		const { name, value } = e.target
		setLocalUser({ ...localUser, [name]: value })
	}

	const handleSave = () => {
		alert('Profile updated successfully!')
	}

	const mockDatasets = [
		{
			datasetId: '1',
			title: 'Customer Satisfaction Survey',
			description: 'Annual customer feedback data',
			size: '2.4 MB',
			type: 'CSV',
			owner: 'Max Musterman',
			uploadDate: '2023-05-15',
		},
		{
			datasetId: '2',
			title: 'Sales Analytics 2023',
			description: 'Quarterly sales performance data',
			size: '3.7 MB',
			type: 'JSON',
			owner: 'Max Musterman',
			uploadDate: '2023-06-22',
		},
	]

	return (
		<div className='page-container'>
			<div className='profile-page'>
				<section className='detail-section'>
					<div className='container'>
						<h1 className='title'>User Profile</h1>
						<p className='description'>
							Manage your personal information and datasets
						</p>
					</div>
				</section>

				<section className='detail-section'>
					<div className='profile-container'>
						<div className='profile-left'>
							<img
								src={localUser.profilePic || defaultAvatar}
								alt='Profile'
								className='profile-avatar'
							/>
							<h3>{localUser.name}</h3>
							<p className='user-role'>User</p>
							<p className='user-location'>{localUser.address}</p>
							<div className='file-input-container'>
								<label className='file-input-label'>
									Change Profile Picture
									<input type='file' onChange={handleFileChange} />
								</label>
							</div>
						</div>

						<div className='profile-right'>
							<div className='profile-form'>
								<div className='form-group'>
									<label>Full Name</label>
									<input
										type='text'
										name='name'
										value={localUser.name}
										onChange={handleChange}
									/>
								</div>
								<div className='form-group'>
									<label>Username</label>
									<input
										type='text'
										name='username'
										value={localUser.username}
										onChange={handleChange}
									/>
								</div>
								<div className='form-group'>
									<label>Email</label>
									<input
										type='email'
										name='email'
										value={localUser.email}
										onChange={handleChange}
									/>
								</div>
								<div className='form-group'>
									<label>Address</label>
									<input
										type='text'
										name='address'
										value={localUser.address}
										onChange={handleChange}
									/>
								</div>
								<button className='save-button' onClick={handleSave}>
									Save Changes
								</button>
							</div>
						</div>
					</div>
				</section>

				<section className='detail-section'>
					<div className='container'>
						<h2 className='title'>Your Datasets</h2>
						<div className='profile-dataset-table'>
							{mockDatasets.length === 0 ? (
								<p>No datasets uploaded.</p>
							) : (
								<table>
									<thead>
										<tr>
											<th>Title</th>
											<th>Description</th>
											<th>Size</th>
											<th>Type</th>
											<th>Uploaded</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{mockDatasets.map(ds => (
											<tr key={ds.datasetId}>
												<td>{ds.title}</td>
												<td>{ds.description}</td>
												<td>{ds.size}</td>
												<td>{ds.type}</td>
												<td>{ds.uploadDate}</td>
												<td className='action-buttons'>
													<button className='action-button view'>View</button>
													<button className='action-button download'>
														Download
													</button>
													<button className='action-button delete'>
														Delete
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</section>
					<section className="logout-section">
							<button
								className="logout-button"
								onClick={() => {
								localStorage.clear(); // Supprime les tokens s'il y en a
								window.location.href = '/login'; // Redirige vers la page de login
								}}
								>
								Logout
							</button>
					</section>

			</div>
		</div>
	)
}

