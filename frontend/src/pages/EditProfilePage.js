import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const EditProfilePage = () => {
  const { user, setUser } = useAuth(); // Assuming setUser is exposed by AuthContext to update global state
  const navigate = useNavigate();

  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Pre-fill form with current user data
    if (user) {
      // We need to fetch the full profile to get the bio
      // The user object in AuthContext might be minimal
      apiService.fetchUserProfile(user.username)
        .then(response => {
          setBio(response.data.user.profile_bio || '');
          setAvatarUrl(response.data.user.avatar_url || '');
        })
        .catch(err => {
          setError('Could not load profile data.');
        });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // This will be a new method in apiService
      const response = await apiService.updateUserProfile({ profile_bio: bio, avatar_url: avatarUrl });

      // Update the user in AuthContext if setUser is available
      if (setUser) {
          // Ideally, the backend returns the full updated user object
          // For now, let's just update what we have.
          const updatedUser = { ...user, profile_bio: response.data.profile_bio, avatar_url: response.data.avatar_url };
          setUser(updatedUser);
          // Also update localStorage if it's used for persistence
          localStorage.setItem('authUser', JSON.stringify(updatedUser));
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate(`/users/${user.username}`), 1500); // Redirect back to profile
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="form-group">
          <label htmlFor="bio">Biography:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            style={{width: '100%', padding: '10px', boxSizing: 'border-box'}}
          />
        </div>

        <div className="form-group">
          <label htmlFor="avatarUrl">Avatar URL:</label>
          <input
            type="text"
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
