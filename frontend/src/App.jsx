import { Routes, Route } from 'react-router-dom';
import Landing from './landing';
import Login from './login';
import Register from './register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
