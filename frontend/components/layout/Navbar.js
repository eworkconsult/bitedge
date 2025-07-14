'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../common/SearchBar';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/" className="navbar-brand">Bitedge Network</Link>
        <div className="navbar-center">
          <SearchBar />
        </div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link href="/" className="nav-link">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link href={`/users/${user.username}`} className="nav-link">
                  Welcome, {user?.username || 'User'}!
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/settings/profile" className="nav-link">Edit Profile</Link>
              </li>
              {user?.isAdmin && (
                <li className="nav-item">
                  <Link href="/admin" className="nav-link">Admin</Link>
                </li>
              )}
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn-link">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link href="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link href="/register" className="nav-link">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
