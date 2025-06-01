// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/ForgotPassword";
import DetailPages from "./pages/Detailpages";
import Datasets from "./pages/Datasets";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/detailpages/:id" element={<DetailPages />} />
      <Route path="/dashboard/dataset" element={<Datasets />} />
      <Route path="/dashboard/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
