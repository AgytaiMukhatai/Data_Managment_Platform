import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        setSuccess('Registration successful! Please verify your email.');
        
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <img src="/Images/Logo-sans arriere plan.png" alt="Logo" className="register-logo" />
        <h2>Create Account</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <button type="submit">Register</button>
        </form>
        <p className="register-footer-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        
      </div>
    </div>
  );
}