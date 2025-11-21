import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaUser, FaArrowRight } from 'react-icons/fa';
import '../styles/Auth.css';

function Login() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-circle">
              <FaBook className="logo-icon" />
            </div>
            <h1>Welcome Back</h1>
            <p>Continue your reading journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">
                <FaUser className="input-icon" />
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="auth-input"
              />
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  Continue
                  <FaArrowRight className="button-icon" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              New to Book Notes?{' '}
              <Link to="/signup" className="auth-link">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="features-sidebar">
          <h3>✨ Your Personal Library</h3>
          <ul className="features-list">
            <li>📚 Track all your books</li>
            <li>📝 Take detailed notes</li>
            <li>🎯 Organize by date</li>
            <li>💡 Never forget insights</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
