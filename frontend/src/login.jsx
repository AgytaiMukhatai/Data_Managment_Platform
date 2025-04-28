import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8000/api/login/', {  // your Django login endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);  // Store the token
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert('Login failed: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };
   

  return (
    <div className="login-page">
      <div className="login-container">
        <img src="/Images/Logo-sans arriere plan.png" alt="Logo" className="login-logo" />
        <h2>Connexion</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-options">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <button type="submit">Se connecter</button>
        </form>

        <p className="login-footer-text">
          Don't have an account? <Link to="/register" className="rg">Register now</Link>
        </p>
      </div>
    </div>
  );
}