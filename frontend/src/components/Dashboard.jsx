// src/components/Dashboard.jsx
import { useEffect, useState } from 'react'
import Datasets from '../pages/Datasets'
import Profile from '../pages/Profile'
import './dashboard.css'
import Sidebar from './Sidebar'
import UploadModal from './UploadModal'

export default function Dashboard() {
	const [activePage, setActivePage] = useState('datasets')
	const [isUploadOpen, setIsUploadOpen] = useState(false)
	const [datasets, setDatasets] = useState([])

	useEffect(() => {
		const mockDatasets = [
			{
				datasetId: 1,
				title: 'Customer Satisfaction Survey Results',
				description:
					'Annual customer satisfaction survey with ratings across service aspects and demographics.',
				size: '2.4 MB',
				type: 'Tabular',
				owner: 'John Smith',
				uploadDate: '2025-05-08',
				likes: 45,
				views: 127,
			},
			{
				datasetId: 2,
				title: 'Global Temperature Trends',
				description:
					'Historical temperature data from weather stations around the world since 1950.',
				size: '5.7 MB',
				type: 'Tabular',
				owner: 'Climate Research Center',
				uploadDate: '2025-04-22',
				likes: 78,
				views: 349,
			},
			{
				datasetId: 3,
				title: 'Medical Imaging Collection',
				description:
					'Anonymized MRI scans for research purposes with associated metadata.',
				size: '156 MB',
				type: 'Image',
				owner: 'Healthcare Institute',
				uploadDate: '2025-05-01',
				likes: 32,
				views: 87,
			},
			{
				datasetId: 4,
				title: 'Twitter Sentiment Analysis',
				description:
					'Tweets regarding climate change with sentiment labels (positive, negative, neutral).',
				size: '8.3 MB',
				type: 'Text',
				owner: 'Social Media Analytics',
				uploadDate: '2025-04-12',
				likes: 124,
				views: 562,
			},
		]

		setDatasets(mockDatasets)
	}, [])

	const handleUpload = newDataset => {
		setDatasets(prev => [...prev, { ...newDataset, datasetId: Date.now() }])
	}

	const renderContent = () => {
		switch (activePage) {
			case 'datasets':
				return (
					<Datasets
						datasets={datasets}
						setDatasets={setDatasets}
						onOpenUploadModal={() => setIsUploadOpen(true)}
					/>
				)
			case 'profile':
				return <Profile datasets={datasets} setDatasets={setDatasets} />
			default:
				return null
		}
	}

	return (
		<div className='dashboard-container'>
			<Sidebar activePage={activePage} setActivePage={setActivePage} />
			<div className='main-section'>
				<div className='content-section'>{renderContent()}</div>
				<UploadModal
					isOpen={isUploadOpen}
					onClose={() => setIsUploadOpen(false)}
					onUpload={handleUpload}
				/>
			</div>
		</div>
	)
}
