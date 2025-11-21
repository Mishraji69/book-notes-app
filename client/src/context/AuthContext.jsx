import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('bookNotesUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (name) => {
    try {
      const response = await api.login(name);
      const userData = {
        userId: response.data.userId,
        userName: name
      };
      setUser(userData);
      localStorage.setItem('bookNotesUser', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name) => {
    try {
      const response = await api.signup(name);
      const userData = {
        userId: response.data.userId,
        userName: name
      };
      setUser(userData);
      localStorage.setItem('bookNotesUser', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookNotesUser');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
