import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';
// import './CategoryPage.css'; // Optional

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategoryDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiService.fetchCategoryDetails(categorySlug);
        setCategory(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || `Failed to load category: ${categorySlug}.`);
        console.error(`Error fetching category ${categorySlug}:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      loadCategoryDetails();
    }
  }, [categorySlug]);

  if (loading) return <p>Loading category details...</p>;
  if (error) return <p className="error-message" style={{color: 'red'}}>{error}</p>;
  if (!category) return <p>Category not found.</p>;

  return (
    <div className="category-page">
      <h1>{category.name}</h1>
      <p>{category.description || 'No description for this category.'}</p>

      <h3>Forums in this category:</h3>
      {category.forums && category.forums.length > 0 ? (
        <ul className="forum-list">
          {category.forums.map(forum => (
            <li key={forum.id} className="forum-item">
              <Link to={`/forums/${forum.slug}`}>
                <h4>{forum.name}</h4>
              </Link>
              <p>{forum.description || 'No description.'}</p>
              <small>Topics: {forum.topic_count || 0} | Posts: {forum.post_count || 0}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No forums found in this category.</p>
      )}
      {/* Basic styling (can be moved to CSS file) */}
      <style jsx>{`
        .forum-list {
          list-style: none;
          padding: 0;
        }
        .forum-item {
          background-color: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 10px 15px;
          margin-bottom: 10px;
        }
        .forum-item h4 {
          margin-top: 0;
          margin-bottom: 0.3rem;
        }
        .forum-item a {
          text-decoration: none;
          color: inherit;
        }
        .forum-item a:hover h4 {
          color: #0056b3;
        }
        .forum-item p {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.25rem;
        }
        .forum-item small {
          font-size: 0.8rem;
          color: #777;
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;
