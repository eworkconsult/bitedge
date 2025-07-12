import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api'; // Using the default export
// import './HomePage.css'; // Optional for styling

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await apiService.fetchCategories();
        setCategories(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load categories.');
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="error-message" style={{color: 'red'}}>{error}</p>;

  return (
    <div className="home-page">
      <h1>Welcome to Bitedge Network!</h1>
      <p>Your central hub for all things crypto. Explore our categories below:</p>

      {categories.length === 0 ? (
        <p>No categories available at the moment.</p>
      ) : (
        <ul className="category-list">
          {categories.map(category => (
            <li key={category.id} className="category-item">
              <Link to={`/categories/${category.slug}`}>
                <h2>{category.name}</h2>
              </Link>
              <p>{category.description || 'No description available.'}</p>
              {/* Optionally display forum count or other stats if available from API */}
            </li>
          ))}
        </ul>
      )}
      {/* Basic styling for category list (can be moved to CSS file) */}
      <style jsx>{`
        .category-list {
          list-style: none;
          padding: 0;
        }
        .category-item {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .category-item h2 {
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        .category-item a {
          text-decoration: none;
          color: inherit;
        }
        .category-item a:hover h2 {
          color: #0056b3;
        }
        .category-item p {
          color: #555;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
