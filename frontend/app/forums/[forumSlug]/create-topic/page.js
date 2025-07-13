'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import apiService from '../../../../services/api';
import RichTextEditor from '../../../../components/common/RichTextEditor';

const CreateTopicPage = () => {
  const params = useParams(); // In Next.js App router, params are passed as props to the page component
  const router = useRouter();
  const forumSlug = params.forumSlug;

  const [forumName, setForumName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch forum name for display purposes
    apiService.fetchForumDetails(forumSlug)
      .then(res => setForumName(res.data.name))
      .catch(err => console.error("Failed to fetch forum name", err));
  }, [forumSlug]);

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
      router.push(`/topics/${response.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create topic.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create Topic in "{forumName || 'Forum'}"</h2>
      <p>
        <Link href={`/forums/${forumSlug}`}>&larr; Back to forum</Link>
      </p>

      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={submitting} />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <RichTextEditor initialValue="" onEditorChange={setContent} disabled={submitting} />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Create Topic'}
        </button>
      </form>
    </div>
  );
};

export default CreateTopicPage;
