import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // To show "Reply" button/form
import apiService from '../services/api';
import RichTextEditor from '../components/common/RichTextEditor'; // Import the new component
import EditPostModal from '../components/modals/EditPostModal'; // Import the modal
// import './TopicPage.css'; // Optional

const TopicPage = () => {
  const { topicSlug } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth(); // For reply and edit/delete functionality

  // State for new post content if implementing reply form directly on this page
  const [replyContent, setReplyContent] = useState('');
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState('');

  // State for Edit Post Modal
  const [editingPost, setEditingPost] = useState(null); // The post object to edit
  const isEditModalOpen = !!editingPost;

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
  };

  const handleCloseEditModal = () => {
    setEditingPost(null);
  };

  const handlePostUpdated = (updatedPost) => {
    // Update the post in the local state to see changes immediately
    setTopic(prevTopic => ({
      ...prevTopic,
      posts: prevTopic.posts.map(p => p.id === updatedPost.id ? updatedPost : p)
    }));
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
        try {
            await apiService.deletePost(postId);
            // Re-fetch topic data to show the updated post list and counts
            // A more optimistic UI update would be to filter the post out of the local state
            setTopic(prevTopic => ({
                ...prevTopic,
                posts: prevTopic.posts.filter(p => p.id !== postId)
            }));
            // Note: This optimistic update won't reflect updated reply counts on the topic
            // until the next full fetch. For this app, re-fetching is fine.
            // Let's just re-fetch for simplicity and accuracy.
            fetchTopicData();
        } catch (err) {
            alert(`Failed to delete post: ${err.response?.data?.message || err.message}`);
            console.error("Error deleting post:", err);
        }
    }
  };

  const fetchTopicData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.fetchTopicDetails(topicSlug);
      setTopic(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to load topic: ${topicSlug}.`);
      console.error(`Error fetching topic ${topicSlug}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicSlug) {
      fetchTopicData();
    }
  }, [topicSlug]);

  const handleEditorChange = (content) => {
    setReplyContent(content);
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
        await apiService.createPost(topicSlug, { content: replyContent });
        setReplyContent(''); // Clear reply box
        await fetchTopicData(); // Refresh topic data to show new post
    } catch (err) {
        setReplyError(err.response?.data?.message || err.message || "Failed to submit reply.");
        console.error("Error submitting reply:", err);
    } finally {
        setReplying(false);
    }
  };


  if (loading) return <p>Loading topic details...</p>;
  if (error) return <p className="error-message" style={{color: 'red'}}>{error}</p>;
  if (!topic) return <p>Topic not found.</p>;

  return (
    <>
    <div className="topic-page">
      <h1>{topic.title}</h1>
      <p>
        In <Link to={`/forums/${topic.forum?.slug}`}>{topic.forum?.name || 'Forum'}</Link>
        {' > '}
        <Link to={`/categories/${topic.forum?.category?.slug}`}>{topic.forum?.category?.name || 'Category'}</Link>
      </p>
      <p>Started by: {topic.user?.username || 'Unknown'} on {new Date(topic.createdAt).toLocaleString()}</p>

      <div className="post-list">
        {topic.posts && topic.posts.length > 0 ? (
          topic.posts.map(post => (
            <div key={post.id} className="post-item">
              <div className="post-header">
                <div className="post-author">
                  <img src={post.user?.avatar_url || '/default-avatar.png'} alt={post.user?.username} className="avatar" />
                  <strong>{post.user?.username || 'User'}</strong>
                  <small>Posted on: {new Date(post.createdAt).toLocaleString()}</small>
                </div>
                {isAuthenticated && (user?.isAdmin || user?.userId === post.user?.id) && (
                  <div className="post-actions">
                    <button onClick={() => handleOpenEditModal(post)} className="btn-sm btn-secondary">Edit</button>
                    <button onClick={() => handleDeletePost(post.id)} className="btn-sm btn-danger">Delete</button>
                  </div>
                )}
              </div>
              <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }}>
                {/* The backend should sanitize this HTML before storing. Assuming it's safe. */}
              </div>
            </div>
          ))
        ) : (
          <p>No posts in this topic yet.</p>
        )}
      </div>

      {isAuthenticated && !topic.is_locked && (
        <div className="reply-form-container">
          <h3>Reply to this Topic</h3>
          <form onSubmit={handleReplySubmit}>
            {replyError && <p className="error-message" style={{color: 'red'}}>{replyError}</p>}
            <RichTextEditor
              initialValue={replyContent}
              onEditorChange={handleEditorChange}
              disabled={replying}
            />
            <button type="submit" disabled={replying} className="btn-primary" style={{marginTop: '10px'}}>
              {replying ? 'Submitting...' : 'Submit Reply'}
            </button>
          </form>
        </div>
      )}
      {topic.is_locked && <p style={{marginTop: '20px', fontWeight: 'bold'}}>This topic is locked. No new replies can be added.</p>}


      {/* Basic styling (can be moved to CSS file) */}
      <style jsx>{`
        .post-list {
          margin-top: 20px;
        }
        .post-item {
          background-color: #fff;
          border: 1px solid #e7e7e7;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
        }
        .post-author {
          display: flex;
          align-items: center;
        }
        .post-actions button {
          margin-left: 10px;
        }
        .btn-sm {
            padding: 0.2rem 0.5rem;
            font-size: 0.8rem;
            border-radius: 0.2rem;
        }
        .btn-secondary {
            background-color: #6c757d;
            color: white;
            border-color: #6c757d;
        }
        .btn-danger {
            background-color: #dc3545;
            color: white;
            border-color: #dc3545;
        }
        .post-author .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          object-fit: cover; /* Ensure avatar aspect ratio is maintained */
        }
        .post-author strong {
          margin-right: auto; /* Pushes date to the right */
        }
        .post-author small {
          font-size: 0.8rem;
          color: #777;
        }
        .post-content {
          line-height: 1.6;
          font-size: 1rem;
        }
        .reply-form-container {
            margin-top: 30px;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .reply-form-container h3 {
            margin-top: 0;
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
        .btn-primary:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
      `}</style>
    </div>
    {isEditModalOpen && (
      <EditPostModal
        post={editingPost}
        onClose={handleCloseEditModal}
        onPostUpdated={handlePostUpdated}
      />
    )}
    </>
  );
};

export default TopicPage;
