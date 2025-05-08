import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/forgot_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccessMessage('Password reset email sent!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send password reset email.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while sending the reset email.');
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <img src="/Images/Logo-sans arriere plan.png" alt="Logo" className="login-logo" />
        <h2>Forgot Password</h2>
        <form className="forgot-password-form" onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <button type="submit">Send Reset Link</button>
        </form>
        <p className="forgot-password-footer-text">
          Remember your password? <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
}