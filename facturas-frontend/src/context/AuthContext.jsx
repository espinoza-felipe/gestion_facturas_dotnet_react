import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('token');
  const [token, setToken] = useState(storedToken || null);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/Auth/login`, { username, password });
      const token = response.data.token;

      localStorage.setItem('token', token);
      setToken(token);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error de login:', err);
      setError('Usuario o contraseña incorrectos.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
