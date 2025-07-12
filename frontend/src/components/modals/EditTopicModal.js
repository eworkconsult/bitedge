import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import './Modal.css'; // Reusing the generic modal stylesheet

const EditTopicModal = ({ topic, onClose, onTopicUpdated }) => {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (topic) {
      setTitle(topic.title);
    }
  }, [topic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await apiService.updateTopic(topic.slug, { title });
      onTopicUpdated(response.data); // Pass updated topic data back to parent
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update topic.');
      console.error("Error updating topic:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!topic) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Topic</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
            <div className="form-group">
              <label htmlFor="topic-title">Title:</label>
              <input
                type="text"
                id="topic-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={submitting}
                style={{width: '100%', padding: '10px', boxSizing: 'border-box'}} // Inline style for simplicity
              />
            </div>
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

export default EditTopicModal;
