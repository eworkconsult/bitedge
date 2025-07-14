'use client';

import { useState, useEffect } from 'react';
import apiService from '../services/api';

const useAds = (page_type, identifier) => {
  const [ads, setAds] = useState({}); // Ads grouped by position
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Don't fetch if page_type isn't defined yet
    if (!page_type) return;

    const fetchAds = async () => {
      try {
        setLoading(true);
        setError('');
        // This will be a new method in apiService
        const response = await apiService.fetchActiveAds(page_type, identifier);
        setAds(response.data);
      } catch (err) {
        // Don't show ad errors to the user, just log them
        console.error("Failed to load ads:", err.response?.data?.message || err.message);
        setError('Failed to load ads.'); // Optional: for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchAds();

  }, [page_type, identifier]); // Re-fetch if the page context changes

  return { ads, loading, error };
};

export default useAds;
