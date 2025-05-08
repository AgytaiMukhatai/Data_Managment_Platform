import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './datasetDetail.css'

export default function DatasetDetail() {
	const { id } = useParams()
	const [dataset, setDataset] = useState(null)
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		setTimeout(() => {
			setDataset({
				id: id,
				name: 'Customer Satisfaction Survey Results',
				description:
					'This dataset contains results from our annual customer satisfaction survey, including ratings across different service aspects, demographic information, and free-text feedback. The data has been anonymized for privacy reasons.',
				size: '2.4 MB',
				type: 'Tabular',
				uploadDate: '2025-05-08',
				user: 'John Smith',
				likes: 45,
				views: 127,
				metrics: {
					missingValues: '5%',
					rowCount: 5432,
					columnCount: 32,
					dataTypes: {
						numeric: 18,
						categorical: 10,
						datetime: 2,
						text: 2,
					},
					missingValuesPerColumn: [
						{ column: 'Age', count: 35 },
						{ column: 'Income', count: 87 },
						{ column: 'Feedback', count: 123 },
						{ column: 'Rating', count: 12 },
						{ column: 'Location', count: 43 },
						{ column: 'CustomerID', count: 0 },
						{ column: 'PurchaseHistory', count: 67 },
					],
				},
				preview: [
					{
						CustomerID: 'CS001',
						Age: 34,
						Gender: 'Male',
						Location: 'New York',
						Rating: 4.5,
						Feedback: 'Great service!',
					},
					{
						CustomerID: 'CS002',
						Age: 27,
						Gender: 'Female',
						Location: 'Los Angeles',
						Rating: 3.8,
						Feedback: 'Good but could improve',
					},
					{
						CustomerID: 'CS003',
						Age: 45,
						Gender: 'Male',
						Location: 'Chicago',
						Rating: 4.2,
						Feedback: 'Very satisfied',
					},
					{
						CustomerID: 'CS004',
						Age: 31,
						Gender: 'Female',
						Location: 'Houston',
						Rating: 4.7,
						Feedback: 'Excellent experience',
					},
					{
						CustomerID: 'CS005',
						Age: 52,
						Gender: 'Male',
						Location: 'Miami',
						Rating: 3.5,
						Feedback: 'Average service',
					},
				],
			})
			setLoading(false)
		}, 500)
	}, [id])

	if (loading) {
		return <div className='loading'>Loading dataset information...</div>
	}

	const maxMissingValue = Math.max(
		...dataset.metrics.missingValuesPerColumn.map(item => item.count)
	)

	const calculateHeight = value => {
		const maxHeight = 220
		const minHeight = 20

		const calculatedHeight =
			minHeight + (value / maxMissingValue) * (maxHeight - minHeight)

		return `${Math.round(calculatedHeight)}px`
	}

	return (
		<div className='page-container'>
			<Sidebar activePage='datasets' />

			<div className='dataset-detail-page'>
				<section className='detail-section'>
					<div className='container'>
						<div className='back-button-container'>
							<button className='back-button' onClick={() => navigate(-1)}>
								&larr; Back
							</button>
						</div>
						<h1 className='title'>Dataset Preview</h1>
						<p className='description'>
							Explore the first few rows of the dataset
						</p>
					</div>
				</section>

				<section className='list-section'>
					<div className='table-container'>
						<table className='data-preview-table'>
							<thead>
								<tr>
									{dataset.preview &&
										Object.keys(dataset.preview[0]).map(key => (
											<th key={key}>{key}</th>
										))}
								</tr>
							</thead>
							<tbody>
								{dataset.preview &&
									dataset.preview.map((row, index) => (
										<tr key={index}>
											{Object.values(row).map((cell, cellIndex) => (
												<td key={cellIndex}>{cell}</td>
											))}
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</section>

				<section className='detail-section'>
					<div className='container'>
						<h2 className='title'>Dataset Description</h2>
						<p className='description-text'>{dataset.description}</p>
					</div>
				</section>

				<section className='detail-section metrics-section'>
					<div className='container'>
						<h2 className='title'>Data Metrics</h2>

						<div className='metrics-list'>
							<div className='metric-row'>
								<div className='metric-card'>
									<h3>Missing Values</h3>
									<p className='metric-value'>
										{dataset.metrics.missingValues}
									</p>
								</div>
								<div className='metric-card'>
									<h3>Row Count</h3>
									<p className='metric-value'>{dataset.metrics.rowCount}</p>
								</div>
								<div className='metric-card'>
									<h3>Column Count</h3>
									<p className='metric-value'>{dataset.metrics.columnCount}</p>
								</div>
							</div>
						</div>

						<div className='graph-container'>
							<div className='graph-card'>
								<h3>Missing Values per Column</h3>
								<p className='axis-label'>Count</p>
								<div className='graph'>
									{dataset.metrics.missingValuesPerColumn
										.slice(0, 7)
										.map((item, index) => {
											const colorClass =
												item.count > 80
													? '#e74c3c'
													: item.count > 30
													? '#f39c12'
													: '#3498db'

											return (
												<div className='bar-container' key={index}>
													<div
														className='bar-value'
														style={{
															color: colorClass,
															fontWeight: item.count > 80 ? '700' : '600',
														}}
													>
														{item.count}
													</div>
													<div
														className='bar'
														style={{
															height: calculateHeight(item.count),
															backgroundColor: colorClass,
														}}
													></div>
													<div className='bar-label'>{item.column}</div>
												</div>
											)
										})}
								</div>
								<p className='x-axis-label'>Column Name</p>
							</div>
						</div>
					</div>
				</section>

				<section className='detail-section'>
					<div className='container'>
						<h2 className='title'>Visualizations</h2>
						<p className='description'>
							Insights to understand the dataset structure
						</p>

						<div className='visualizations-row'>
							<div className='visualization-card'>
								<h3>Categorical Data Distribution</h3>
								<p className='axis-label'>Count</p>
								<div className='pie-chart'>
									<div className='pie-segment segment1'></div>
									<div className='pie-segment segment2'></div>
									<div className='pie-segment segment3'></div>
								</div>
								<p className='x-axis-label'>Categories</p>
							</div>

							<div className='visualization-card'>
								<h3>Numerical Data Spread</h3>
								<p className='axis-label'>Frequency</p>
								<div className='histogram'>
									<div className='histogram-bar'></div>
									<div className='histogram-bar'></div>
									<div className='histogram-bar'></div>
									<div className='histogram-bar'></div>
									<div className='histogram-bar'></div>
								</div>
								<p className='x-axis-label'>Value</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}
