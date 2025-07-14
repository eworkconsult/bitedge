'use client';

import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import AdFormModal from '../../../components/modals/AdFormModal';

const ManageAdsPage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingAd(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ad) => {
    setEditingAd(ad);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAd(null);
  };

  const fetchAds = async () => {
    try {
      setLoading(true);
      // This will be a new method in apiService
      const response = await apiService.listAdvertisements();
      setAds(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load advertisements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (adId) => {
    if (window.confirm('Are you sure you want to permanently delete this advertisement?')) {
      try {
        await apiService.deleteAdvertisement(adId);
        // Optimistically update UI by filtering out the deleted ad
        setAds(prevAds => prevAds.filter(ad => ad.id !== adId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete advertisement.');
      }
    }
  };

  if (loading) return <p>Loading advertisements...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
    <div className="manage-ads-page">
      <div className="page-header">
        <h1>Manage Advertisements</h1>
        <button onClick={handleOpenCreateModal} className="btn-primary">Create New Ad</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Target Type</th>
            <th>Target Identifier</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.length > 0 ? (
            ads.map(ad => (
              <tr key={ad.id}>
                <td>{ad.name}</td>
                <td>{ad.target_page_type}</td>
                <td>{ad.target_identifier || 'N/A'}</td>
                <td>{ad.position}</td>
                <td>{ad.is_active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => handleOpenEditModal(ad)} className="btn-sm btn-secondary">Edit</button>
                  <button onClick={() => handleDelete(ad.id)} className="btn-sm btn-danger" style={{marginLeft: '5px'}}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No advertisements found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
    {isModalOpen && (
      <AdFormModal
        ad={editingAd}
        onClose={handleCloseModal}
        onSave={() => {
          // When an ad is saved, refresh the list
          fetchAds();
        }}
      />
    )}
    </>
  );
};

export default ManageAdsPage;
