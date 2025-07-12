import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Corrected path
import './Navbar.css'; // For Navbar specific styles

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth(); // Get isAuthenticated as well
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // AuthContext logout clears local state
      // No need to call backend logout via apiService here if it's conceptual for JWT
      // If backend logout is stateful (e.g. token blacklisting), call it:
      // await apiService.logoutUser();
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed", error);
      // Handle logout error if necessary
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">Bitedge Network</Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          {/* TODO: Add other links like Categories, Forums etc. */}

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                {/* Link to a profile page could go here */}
                <span className="nav-link">Welcome, {user?.username || 'User'}!</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn-link">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
