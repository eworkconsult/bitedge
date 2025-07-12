import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';
import RichTextEditor from '../components/common/RichTextEditor';
// import './AuthForm.css'; // Re-using auth form styles for consistency

const CreateTopicPage = () => {
  const { forumSlug } = useParams();
  const navigate = useNavigate();

  const [forum, setForum] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [loading, setLoading] = useState(true); // For fetching forum details
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await apiService.fetchForumDetails(forumSlug);
        setForum(response.data);
      } catch (err) {
        setError(`Failed to load forum details. You may not be able to create a topic. Error: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForum();
  }, [forumSlug]);

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await apiService.createTopic(forumSlug, { title, content });
      // On success, redirect to the newly created topic page
      navigate(`/topics/${response.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create topic.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading forum...</p>;
  }

  return (
    <div className="auth-form-container"> {/* Reusing this class for consistent form styling */}
      {forum ? (
        <h2>Create Topic in "{forum.name}"</h2>
      ) : (
        <h2>Create New Topic</h2>
      )}
      <p>
        <Link to={`/forums/${forumSlug}`}>&larr; Back to forum</Link>
      </p>

      <form onSubmit={handleSubmit}>
        {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label>Content:</label>
          <RichTextEditor
            initialValue=""
            onEditorChange={handleEditorChange}
            disabled={submitting}
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Create Topic'}
        </button>
      </form>
    </div>
  );
};

export default CreateTopicPage;
