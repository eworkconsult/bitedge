import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // To show "Create Topic" button
import apiService from '../services/api';
// import './ForumPage.css'; // Optional

const ForumPage = () => {
  const { forumSlug } = useParams();
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadForumDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiService.fetchForumDetails(forumSlug);
        setForum(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || `Failed to load forum: ${forumSlug}.`);
        console.error(`Error fetching forum ${forumSlug}:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (forumSlug) {
      loadForumDetails();
    }
  }, [forumSlug]);

  if (loading) return <p>Loading forum details...</p>;
  if (error) return <p className="error-message" style={{color: 'red'}}>{error}</p>;
  if (!forum) return <p>Forum not found.</p>;

  return (
    <div className="forum-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{forum.name}</h1>
        {isAuthenticated && (
          <Link to={`/forums/${forumSlug}/create-topic`} className="btn-primary"> {/* Route to be created */}
            Create New Topic
          </Link>
        )}
      </div>
      <p><Link to={`/categories/${forum.category?.slug}`}>Back to {forum.category?.name || 'Category'}</Link></p>
      <p>{forum.description || 'No description for this forum.'}</p>

      <h3>Topics in this forum:</h3>
      {forum.topics && forum.topics.length > 0 ? (
        <ul className="topic-list">
          {forum.topics.map(topic => (
            <li key={topic.id} className="topic-item">
              <div className="topic-main">
                <Link to={`/topics/${topic.slug}`}>
                  <h4>{topic.title}</h4>
                </Link>
                <small>
                  Started by {topic.user?.username || 'Unknown User'} on {new Date(topic.createdAt).toLocaleDateString()}
                </small>
              </div>
              <div className="topic-stats">
                <span>Replies: {topic.reply_count || 0}</span>
                <span>Views: {topic.view_count || 0}</span>
              </div>
              <div className="topic-last-post">
                <small>
                  Last post:
                  {topic.lastPost ? (
                    <>
                      {' by '} {topic.lastPost.user?.username || 'N/A'}
                      {' on '} {new Date(topic.lastPost.createdAt).toLocaleDateString()}
                    </>
                  ) : (
                    ' N/A'
                  )}
                </small>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No topics found in this forum yet. {isAuthenticated ? 'Why not create one?' : ''}</p>
      )}
      {/* Basic styling (can be moved to CSS file) */}
      <style jsx>{`
        .topic-list {
          list-style: none;
          padding: 0;
        }
        .topic-item {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px 15px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px; /* For spacing between flex children */
        }
        .topic-main {
          flex-grow: 1;
        }
        .topic-main h4 {
          margin-top: 0;
          margin-bottom: 0.25rem;
        }
        .topic-main a {
          text-decoration: none;
          color: inherit;
        }
        .topic-main a:hover h4 {
          color: #0056b3;
        }
        .topic-main small, .topic-last-post small {
          font-size: 0.8rem;
          color: #666;
        }
        .topic-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 0.85rem;
          color: #555;
          min-width: 100px; /* Ensure some space for stats */
        }
        .topic-stats span {
            margin-bottom: 2px;
        }
        .topic-last-post {
            min-width: 180px; /* Ensure space for last post info */
            text-align: right;
        }
        .btn-primary { /* Copied from App.css for brevity, should be global */
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            border-radius: 0.25rem;
            cursor: pointer;
            border: 1px solid transparent;
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
            text-decoration: none;
        }
        .btn-primary:hover {
            background-color: #0056b3;
            border-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ForumPage;
