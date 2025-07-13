import React, { useState, useEffect } from 'react';
import RichTextEditor from '../common/RichTextEditor';
import apiService from '../../services/api';
import './Modal.css'; // A generic modal stylesheet

const EditPostModal = ({ post, onClose, onPostUpdated }) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // When the modal is opened and a post is provided, set its content in the editor
    if (post) {
      setContent(post.content);
    }
  }, [post]);

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Content cannot be empty.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await apiService.updatePost(post.id, { content });
      onPostUpdated(response.data); // Pass the updated post data back to the parent
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post.');
      console.error("Error updating post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!post) {
    return null; // Don't render the modal if no post is selected for editing
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Post</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
            <RichTextEditor
              initialValue={content}
              onEditorChange={handleEditorChange}
              disabled={submitting}
            />
            <div className="modal-footer">
              <button type="button" onClick={onClose} disabled={submitting}>Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
