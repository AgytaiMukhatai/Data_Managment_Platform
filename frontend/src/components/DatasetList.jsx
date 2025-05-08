import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import './dashboard.css'

export default function DatasetList({ datasets, onDownload }) {
	const { user, setUser } = useContext(UserContext)
	const navigate = useNavigate()
	const [liked, setLiked] = useState(() =>
		(user.likedDatasets || []).reduce((acc, ds) => {
			acc[ds.datasetId] = true
			return acc
		}, {})
	)

	const toggleLike = dataset => {
		const isLiked = liked[dataset.datasetId]

		setLiked(prev => ({
			...prev,
			[dataset.datasetId]: !isLiked,
		}))

		const updatedLikes = isLiked
			? user.likedDatasets.filter(ds => ds.datasetId !== dataset.datasetId)
			: [...(user.likedDatasets || []), dataset]

		setUser({ ...user, likedDatasets: updatedLikes })
	}

	const viewDetails = datasetId => {
		navigate(`/datasets/${datasetId}`)
	}

	return (
		<section className='dataset-list-section'>
			<h2>Datasets</h2>
			<div className='dataset-list'>
				{datasets.length === 0 ? (
					<p>No datasets uploaded yet.</p>
				) : (
					datasets.map(dataset => (
						<div key={dataset.datasetId} className='dataset-card'>
							<div className='dataset-info'>
								<h3>{dataset.title}</h3>
								<p>{dataset.description}</p>
								<div className='dataset-meta'>
									<span>
										<strong>Size:</strong> {dataset.size}
									</span>
									<span>
										<strong>Type:</strong> {dataset.type}
									</span>
									<span>
										<strong>Owner:</strong> {dataset.owner}
									</span>
									<span>
										<strong>Uploaded:</strong> {dataset.uploadDate}
									</span>
								</div>
							</div>
							<div className='dataset-actions'>
								<button
									onClick={() => viewDetails(dataset.datasetId)}
									className='details-btn'
								>
									View Details
								</button>
								<button
									onClick={() => onDownload(dataset)}
									className='download-btn'
								>
									Download
								</button>
								<button
									className={`like-btn ${
										liked[dataset.datasetId] ? 'liked' : ''
									}`}
									onClick={() => toggleLike(dataset)}
								>
									{liked[dataset.datasetId] ? '♥ Liked' : '♡ Like'}
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</section>
	)
}
