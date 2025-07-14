'use client';

import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import './Modal.css';

const AdFormModal = ({ ad, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    ad_code: '',
    target_page_type: 'all',
    target_identifier: '',
    position: 'header',
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!ad;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: ad.name || '',
        ad_code: ad.ad_code || '',
        target_page_type: ad.target_page_type || 'all',
        target_identifier: ad.target_identifier || '',
        position: ad.position || 'header',
        is_active: ad.is_active,
      });
    } else {
      // Reset for "Create" mode
      setFormData({
        name: '', ad_code: '', target_page_type: 'all', target_identifier: '',
        position: 'header', is_active: true,
      });
    }
  }, [ad, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (isEditing) {
        await apiService.updateAdvertisement(ad.id, formData);
      } else {
        await apiService.createAdvertisement(formData);
      }
      onSave(); // Notify parent to refresh the list
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} ad.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit' : 'Create'} Advertisement</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="name">Ad Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="ad_code">Ad Code (HTML/JS)</label>
            <textarea id="ad_code" name="ad_code" value={formData.ad_code} onChange={handleChange} rows="6" required />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input type="text" id="position" name="position" value={formData.position} onChange={handleChange} required placeholder="e.g., header, sidebar, post_bottom" />
          </div>

          <div className="form-group">
            <label htmlFor="target_page_type">Target Page Type</label>
            <select id="target_page_type" name="target_page_type" value={formData.target_page_type} onChange={handleChange}>
              <option value="all">All Pages</option>
              <option value="category">Category</option>
              <option value="forum">Forum</option>
              <option value="topic">Topic</option>
            </select>
          </div>

          {formData.target_page_type !== 'all' && (
            <div className="form-group">
              <label htmlFor="target_identifier">Target Identifier (Slug)</label>
              <input type="text" id="target_identifier" name="target_identifier" value={formData.target_identifier} onChange={handleChange} placeholder="e.g., 'bitcoin-discussion'" />
            </div>
          )}

          <div className="form-group" style={{display: 'flex', alignItems: 'center'}}>
            <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} style={{width: 'auto', marginRight: '10px'}} />
            <label htmlFor="is_active" style={{marginBottom: 0}}>Active</label>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
       <style jsx>{`
        textarea {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
       `}</style>
    </div>
  );
};

export default AdFormModal;
