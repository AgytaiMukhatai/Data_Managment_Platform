import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import ForgotPassword from './ForgotPassword'
import Landing from './landing'
import Login from './login'
import DatasetDetail from './pages/DatasetDetail'
import Profile from './pages/Profile'
import Register from './register'

function App() {
	return (
		<Routes>
			<Route path='/' element={<Landing />} />
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />
			<Route path='/forgot-password' element={<ForgotPassword />} />
			<Route path='/dashboard' element={<Dashboard />} />
			<Route path='/datasets/:id' element={<DatasetDetail />} />
			<Route path='/profile' element={<Profile />} />
		</Routes>
	)
}

export default App
