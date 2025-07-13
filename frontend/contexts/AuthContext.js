import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api'; // Assuming api.js exports an object with methods

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // For checking initial auth status

  useEffect(() => {
    // Check for existing token on initial load
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser'); // Basic user info
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // TODO: Optionally verify token with a backend endpoint here
        // e.g., fetch('/api/auth/me').then(res => if (!res.ok) logout())
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.loginUser({ email, password });
      const { token, user: loggedInUser } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(loggedInUser)); // Store basic user info
      setUser(loggedInUser);
      return loggedInUser; // Or true for success
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error; // Re-throw to be caught by UI
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await apiService.registerUser({ username, email, password });
      // Optionally log the user in directly after registration
      // Or redirect to login page with a success message
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    // Optionally call a backend logout endpoint if it does anything (e.g., token blacklisting)
    // await apiService.logoutUser();
    // No need to redirect here, components can handle that based on user state
  };

  const value = {
    user,
    setUser, // Expose setUser to allow components to update it
    isAuthenticated: !!user,
    loading, // To allow components to wait for initial auth check
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Don't render children until initial auth check is done */}
    </AuthContext.Provider>
  );
};
