import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaUser, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import '../styles/Auth.css';

function Signup() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
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
            <div className="logo-circle signup-logo">
              <FaBook className="logo-icon" />
            </div>
            <h1>Join Book Notes</h1>
            <p>Start organizing your reading today</p>
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
                minLength="2"
              />
            </div>

            <button type="submit" className="auth-button signup-button" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  Create Account
                  <FaArrowRight className="button-icon" />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="features-sidebar signup-sidebar">
          <h3>🚀 Get Started in Seconds</h3>
          <ul className="features-list">
            <li>
              <FaCheckCircle className="check-icon" />
              No credit card required
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Free forever
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Unlimited books & notes
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Clean, beautiful interface
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Signup;
