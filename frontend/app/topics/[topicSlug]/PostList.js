'use client'; // This directive marks the component as a Client Component

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import useAds from '../../../hooks/useAds'; // Import the new hook
import AdSlot from '../../../components/ads/AdSlot'; // Import the AdSlot component
import apiService from '../../../services/api';
import RichTextEditor from '../../../components/common/RichTextEditor';
import EditPostModal from '../../../components/modals/EditPostModal';

const PostList = ({ initialTopic }) => {
  const [topic, setTopic] = useState(initialTopic);
  const { ads, loading: adsLoading } = useAds('topic', initialTopic.slug);
  const { isAuthenticated, user } = useAuth();

  // State for the reply form
  const [replyContent, setReplyContent] = useState('');
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState('');

  // State for Edit Post Modal
  const [editingPost, setEditingPost] = useState(null);
  const isEditModalOpen = !!editingPost;

  const handleOpenEditModal = (post) => setEditingPost(post);
  const handleCloseEditModal = () => setEditingPost(null);

  const handlePostUpdated = (updatedPost) => {
    setTopic(prevTopic => ({
      ...prevTopic,
      posts: prevTopic.posts.map(p => p.id === updatedPost.id ? updatedPost : p)
    }));
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiService.deletePost(postId);
        setTopic(prevTopic => ({
            ...prevTopic,
            posts: prevTopic.posts.filter(p => p.id !== postId),
            reply_count: Math.max(0, prevTopic.reply_count - 1)
        }));
      } catch (err) {
        alert(`Failed to delete post: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      setReplyError("Reply content cannot be empty.");
      return;
    }
    setReplying(true);
    setReplyError('');
    try {
      const response = await apiService.createPost(topic.slug, { content: replyContent });
      setTopic(prevTopic => ({
        ...prevTopic,
        posts: [...prevTopic.posts, response.data],
        reply_count: prevTopic.reply_count + 1
      }));
      setReplyContent('');
    } catch (err) {
      setReplyError(err.response?.data?.message || "Failed to submit reply.");
    } finally {
      setReplying(false);
    }
  };

  return (
    <>
      {/* Render header ads if they exist */}
      {ads.header && ads.header.map((adCode, index) => (
        <AdSlot key={`header-ad-${index}`} adCode={adCode} />
      ))}

      <div className="post-list">
        {topic.posts && topic.posts.length > 0 ? (
          topic.posts.map((post, postIndex) => (
            <React.Fragment key={post.id}>
            <div className="post-item">
              <div className="post-header">
                <div className="post-author">
                  <Link href={`/users/${post.user?.username}`}>
                    <img src={post.user?.avatar_url || '/default-avatar.png'} alt={post.user?.username} className="avatar" />
                  </Link>
                  <div className="author-details">
                    <strong><Link href={`/users/${post.user?.username}`}>{post.user?.username || 'User'}</Link></strong>
                    <small>Posted on: {new Date(post.createdAt).toLocaleString()}</small>
                  </div>
                </div>
                {isAuthenticated && (user?.isAdmin || user?.userId === post.user?.id) && (
                  <div className="post-actions">
                    <button onClick={() => handleOpenEditModal(post)} className="btn-sm btn-secondary">Edit</button>
                    <button onClick={() => handleDeletePost(post.id)} className="btn-sm btn-danger">Delete</button>
                  </div>
                )}
              </div>
              <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
            {/* Inject an ad after every 3 posts (and if the ad exists) */}
            {(postIndex + 1) % 3 === 0 && ads.post_bottom && (
              <div className="in-content-ad">
                {ads.post_bottom.map((adCode, adIndex) => (
                  <AdSlot key={`post-ad-${postIndex}-${adIndex}`} adCode={adCode} />
                ))}
              </div>
            )}
            </React.Fragment>
          ))
        ) : <p>No posts in this topic yet.</p>}
      </div>

      {isAuthenticated && !topic.is_locked && (
        <div className="reply-form-container">
          <h3>Reply to this Topic</h3>
          <form onSubmit={handleReplySubmit}>
            {replyError && <p className="error-message" style={{color: 'red'}}>{replyError}</p>}
            <RichTextEditor
              initialValue={replyContent}
              onEditorChange={setReplyContent}
              disabled={replying}
            />
            <button type="submit" disabled={replying} className="btn-primary" style={{marginTop: '10px'}}>
              {replying ? 'Submitting...' : 'Submit Reply'}
            </button>
          </form>
        </div>
      )}
      {topic.is_locked && <p style={{marginTop: '20px', fontWeight: 'bold'}}>This topic is locked.</p>}

      {isEditModalOpen && (
        <EditPostModal
          post={editingPost}
          onClose={handleCloseEditModal}
          onPostUpdated={handlePostUpdated}
        />
      )}

      {/* Styles from original TopicPage.js */}
      <style jsx>{`
        .post-list { margin-top: 20px; }
        .post-item { background-color: #fff; border: 1px solid #e7e7e7; border-radius: 5px; padding: 15px; margin-bottom: 15px; }
        .post-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0; }
        .post-author { display: flex; align-items: center; }
        .post-author .avatar { width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; object-fit: cover; }
        .author-details { display: flex; flex-direction: column; }
        .author-details strong { margin-bottom: 2px; }
        .author-details small { font-size: 0.8rem; color: #777; }
        .post-actions button { margin-left: 10px; }
        .btn-sm { padding: 0.2rem 0.5rem; font-size: 0.8rem; border-radius: 0.2rem; }
        .btn-secondary { background-color: #6c757d; color: white; border-color: #6c757d; }
        .btn-danger { background-color: #dc3545; color: white; border-color: #dc3545; }
        .post-content { line-height: 1.6; font-size: 1rem; }
        .reply-form-container { margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px; }
        .reply-form-container h3 { margin-top: 0; }
        .btn-primary { padding: 0.5rem 1rem; font-size: 0.9rem; border-radius: 0.25rem; cursor: pointer; border: 1px solid transparent; color: #fff; background-color: #007bff; border-color: #007bff; text-decoration: none; }
        .btn-primary:hover { background-color: #0056b3; border-color: #0056b3; }
        .btn-primary:disabled { background-color: #ccc; cursor: not-allowed; }
      `}</style>
    </>
  );
};

export default PostList;
