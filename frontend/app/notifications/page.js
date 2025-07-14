'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await apiService.listNotifications();
        setNotifications(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [isAuthenticated]);

  const handleNotificationClick = async (notification) => {
    // Navigate to the topic
    router.push(`/topics/${notification.topic.slug}`);

    // Mark as read if it's not already
    if (!notification.is_read) {
      try {
        await apiService.markNotificationAsRead(notification.id);
        // Optimistically update the UI
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        );
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
        await apiService.markAllNotificationsAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
        console.error("Failed to mark all notifications as read:", err);
        setError("Could not mark all as read. Please try again.");
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Your Notifications</h1>
        <button onClick={handleMarkAllRead} className="btn-secondary">Mark All as Read</button>
      </div>

      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map(n => (
            <div
              key={n.id}
              className={`notification-item ${n.is_read ? 'is-read' : ''}`}
              onClick={() => handleNotificationClick(n)}
            >
              <p>
                <strong>{n.sender.username}</strong> replied to your topic:
                <strong>"{n.topic.title}"</strong>
              </p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>You have no notifications.</p>
        )}
      </div>

      <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .notification-list { list-style: none; padding: 0; }
        .notification-item { background-color: #eef5ff; border-left: 5px solid #007bff; padding: 15px; margin-bottom: 10px; cursor: pointer; transition: background-color 0.2s; }
        .notification-item:hover { background-color: #dbeaff; }
        .notification-item.is-read { background-color: #fff; border-left-color: #ccc; }
        .notification-item.is-read:hover { background-color: #f9f9f9; }
        .notification-item p { margin: 0 0 5px 0; }
        .notification-item strong { margin: 0 4px; }
        .notification-item small { color: #555; }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
