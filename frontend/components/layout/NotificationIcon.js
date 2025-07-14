'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

const NotificationIcon = () => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCount = async () => {
      try {
        // This will be a new method in apiService
        const response = await apiService.getUnreadNotificationCount();
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      }
    };

    fetchCount(); // Initial fetch
    const interval = setInterval(fetchCount, 60000); // Poll every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link href="/notifications" className="notification-icon">
      <span role="img" aria-label="Notifications">🔔</span>
      {unreadCount > 0 && (
        <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
      )}
      <style jsx>{`
        .notification-icon {
          position: relative;
          display: inline-block;
          font-size: 1.5rem; /* Make bell larger */
          color: white;
          text-decoration: none;
        }
        .notification-badge {
          position: absolute;
          top: -5px;
          right: -10px;
          background-color: red;
          color: white;
          border-radius: 50%;
          padding: 2px 6px;
          font-size: 0.75rem;
          font-weight: bold;
          border: 1px solid white;
        }
      `}</style>
    </Link>
  );
};

export default NotificationIcon;
