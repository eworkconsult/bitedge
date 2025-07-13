import React from 'react';
import Link from 'next/link';
import apiService from '../../../services/api';
import { notFound } from 'next/navigation';
// Note: Auth logic will need to be handled differently.
// The `useAuth` hook can only be used in Client Components.
// We will need a new client component to wrap the "Create Topic" button.

export async function generateMetadata({ params }) {
  const { forumSlug } = params;
  try {
    const forum = await getForumDetails(forumSlug);
    return {
      title: `${forum.name} - Bitedge Network`,
      description: forum.description || `Discussions in the ${forum.name} forum.`,
    };
  } catch (error) {
    return {
      title: 'Forum Not Found',
      description: 'The forum you are looking for does not exist.',
    };
  }
}

async function getForumDetails(slug) {
  try {
    const response = await apiService.fetchForumDetails(slug);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) notFound();
    console.error(`Failed to fetch forum ${slug}:`, error);
    notFound();
  }
}

const ForumPage = async ({ params }) => {
  const { forumSlug } = params;
  const forum = await getForumDetails(forumSlug);

  return (
    <div className="forum-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{forum.name}</h1>
        {/* TODO: Add a client component here to conditionally render the "Create Topic" button based on auth state */}
        <Link href={`/forums/${forumSlug}/create-topic`} className="btn-primary">
            Create New Topic
        </Link>
      </div>
      <p><Link href={`/categories/${forum.category?.slug}`}>Back to {forum.category?.name || 'Category'}</Link></p>
      <p>{forum.description || 'No description for this forum.'}</p>

      <h3>Topics in this forum:</h3>
      {forum.topics && forum.topics.length > 0 ? (
        <ul className="topic-list">
          {forum.topics.map(topic => (
            <li key={topic.id} className="topic-item">
              <div className="topic-main">
                <div className="topic-title-container">
                  <Link href={`/topics/${topic.slug}`}>
                    <h4>{topic.title}</h4>
                  </Link>
                  {/* TODO: Add client component for edit/delete buttons */}
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
        <p>No topics found in this forum yet.</p>
      )}
      {/* Styles can be moved to a separate CSS module file */}
      <style jsx>{`
        /* Styles from original ForumPage.js */
        .topic-list { list-style: none; padding: 0; }
        .topic-item { background-color: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 10px 15px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .topic-main { flex-grow: 1; }
        .topic-title-container { display: flex; align-items: center; gap: 15px; }
        .topic-main h4 { margin-top: 0; margin-bottom: 0.25rem; }
        .topic-main a { text-decoration: none; color: inherit; }
        .topic-main a:hover h4 { color: #0056b3; }
        .topic-main small, .topic-last-post small { font-size: 0.8rem; color: #666; }
        .topic-stats { display: flex; flex-direction: column; align-items: flex-end; font-size: 0.85rem; color: #555; min-width: 100px; }
        .topic-stats span { margin-bottom: 2px; }
        .topic-last-post { min-width: 180px; text-align: right; }
        .btn-primary { padding: 0.5rem 1rem; font-size: 0.9rem; border-radius: 0.25rem; cursor: pointer; border: 1px solid transparent; color: #fff; background-color: #007bff; border-color: #007bff; text-decoration: none; }
        .btn-primary:hover { background-color: #0056b3; border-color: #0056b3; }
      `}</style>
    </div>
  );
};

export default ForumPage;
