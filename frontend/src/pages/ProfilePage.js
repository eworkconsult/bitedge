import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        // This will be a new method in our apiService
        const response = await apiService.fetchUserProfile(username);
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || `Failed to load profile for ${username}.`);
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message" style={{color: 'red'}}>{error}</p>;
  if (!profile || !profile.user) return <p>User not found.</p>;

  const { user, pagination } = profile;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.avatar_url || '/default-avatar.png'} alt={`${user.username}'s avatar`} className="profile-avatar" />
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
          <div className="profile-bio">
            <p>{user.profile_bio || 'No biography provided.'}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <h3>Recent Topics by {user.username}</h3>
        {user.topics && user.topics.length > 0 ? (
          <ul className="topic-list">
            {user.topics.map(topic => (
              <li key={topic.id} className="topic-item">
                <Link to={`/topics/${topic.slug}`}>{topic.title}</Link>
                <small>Replies: {topic.reply_count || 0} | Created: {new Date(topic.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>{user.username} has not created any topics yet.</p>
        )}
        {/* TODO: Add pagination controls based on `pagination` object */}
      </div>

      <style jsx>{`
        .profile-page {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
        }
        .profile-header {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }
        .profile-info h1 {
          margin: 0 0 10px 0;
        }
        .profile-info p {
          margin: 0;
          color: #555;
        }
        .profile-bio {
          margin-top: 10px;
          font-style: italic;
        }
        .topic-list {
          list-style: none;
          padding: 0;
        }
        .topic-item {
          padding: 10px;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .topic-item small {
          color: #777;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
