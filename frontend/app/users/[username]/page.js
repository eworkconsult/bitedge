import React from 'react';
import Link from 'next/link';
import apiService from '../../../services/api';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { username } = params;
  try {
    const profile = await getUserProfile(username);
    return {
      title: `Profile of ${profile.user.username} - Bitedge Network`,
      description: profile.user.profile_bio || `View the profile and activity of ${profile.user.username}.`,
    };
  } catch (error) {
    return {
      title: 'User Not Found',
      description: 'The user you are looking for does not exist.',
    };
  }
}

async function getUserProfile(username) {
  try {
    const response = await apiService.fetchUserProfile(username);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) notFound();
    console.error(`Failed to fetch profile for ${username}:`, error);
    notFound();
  }
}

const ProfilePage = async ({ params }) => {
  const { username } = params;
  const profile = await getUserProfile(username);
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
                <Link href={`/topics/${topic.slug}`}>{topic.title}</Link>
                <small>Replies: {topic.reply_count || 0} | Created: {new Date(topic.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>{user.username} has not created any topics yet.</p>
        )}
      </div>

      <style jsx>{`
        /* Styles from original ProfilePage.js */
        .profile-page { background-color: #fff; padding: 20px; border-radius: 8px; }
        .profile-header { display: flex; align-items: flex-start; gap: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
        .profile-avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; }
        .profile-info h1 { margin: 0 0 10px 0; }
        .profile-info p { margin: 0; color: #555; }
        .profile-bio { margin-top: 10px; font-style: italic; }
        .topic-list { list-style: none; padding: 0; }
        .topic-item { padding: 10px; border: 1px solid #f0f0f0; border-radius: 4px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        .topic-item small { color: #777; }
      `}</style>
    </div>
  );
};

export default ProfilePage;
