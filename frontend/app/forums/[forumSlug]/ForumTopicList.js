'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import useAds from '../../../hooks/useAds';
import AdSlot from '../../../components/ads/AdSlot';

const ForumTopicList = ({ initialForum }) => {
  const { slug: forumSlug } = initialForum; // Get slug from the initial forum data
  const { isAuthenticated, user } = useAuth();
  const { ads } = useAds('forum', initialForum.slug);

  // Note: Edit/Delete logic for topics would also be handled here
  // For now, just displaying the topics and ads.

  return (
    <>
      {/* Header Ads */}
      {ads.header && ads.header.map((adCode, index) => (
        <AdSlot key={`header-ad-${index}`} adCode={adCode} />
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Topics in this forum:</h3>
        {isAuthenticated && (
          <Link href={`/forums/${forumSlug}/create-topic`} className="btn-primary">
            Create New Topic
          </Link>
        )}
      </div>

      {initialForum.topics && initialForum.topics.length > 0 ? (
        <ul className="topic-list">
          {initialForum.topics.map(topic => (
            <li key={topic.id} className="topic-item">
              <div className="topic-main">
                <div className="topic-title-container">
                  <Link href={`/topics/${topic.slug}`}>
                    <h4>{topic.title}</h4>
                  </Link>
                  {isAuthenticated && (user?.isAdmin || user?.userId === topic.user?.id) && (
                    <div className="topic-actions">
                      <button className="btn-sm btn-secondary">Edit</button>
                      <button className="btn-sm btn-danger">Delete</button>
                    </div>
                  )}
                </div>
                <small>
                  Started by <Link href={`/users/${topic.user?.username}`}>{topic.user?.username || 'Unknown User'}</Link> on {new Date(topic.createdAt).toLocaleDateString()}
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
                      {' by '} <Link href={`/users/${topic.lastPost.user?.username}`}>{topic.lastPost.user?.username || 'N/A'}</Link>
                      {' on '} {new Date(topic.lastPost.createdAt).toLocaleDateString()}
                    </>
                  ) : ' N/A'}
                </small>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No topics found in this forum yet. {isAuthenticated ? 'Why not create one?' : ''}</p>
      )}

      {/* Styles from original ForumPage.js, should be global or in a CSS module */}
      <style jsx>{`
        .topic-list { list-style: none; padding: 0; }
        .topic-item { background-color: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 10px 15px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .topic-main { flex-grow: 1; }
        .topic-title-container { display: flex; align-items: center; gap: 15px; }
        .topic-actions button { margin-left: 5px; }
        .btn-sm { padding: 0.2rem 0.5rem; font-size: 0.8rem; border-radius: 0.2rem; }
        .btn-secondary { background-color: #6c757d; color: white; border-color: #6c757d; }
        .btn-danger { background-color: #dc3545; color: white; border-color: #dc3545; }
        .topic-main h4 { margin-top: 0; margin-bottom: 0.25rem; }
        .topic-main a { text-decoration: none; color: inherit; }
        .topic-main a:hover h4 { color: #0056b3; }
        .topic-main small, .topic-last-post small { font-size: 0.8rem; color: #666; }
        .topic-stats { display: flex; flex-direction: column; align-items: flex-end; font-size: 0.85rem; color: #555; min-width: 100px; }
        .topic-stats span { margin-bottom: 2px; }
        .topic-last-post { min-width: 180px; text-align: right; }
      `}</style>
    </>
  );
};

export default ForumTopicList;
