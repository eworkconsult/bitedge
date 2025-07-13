import React from 'react';
import Link from 'next/link'; // Use Next.js Link for client-side navigation
import apiService from '../services/api';

// This is a Server Component in Next.js.
// Data fetching is done directly here on the server.
async function getCategories() {
  try {
    const response = await apiService.fetchCategories();
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    // In a real app, you might have a more robust error handling mechanism
    // that could show a specific error component.
    return [];
  }
}

const HomePage = async () => {
  const categories = await getCategories();

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
              <Link href={`/categories/${category.slug}`}>
                <h2>{category.name}</h2>
              </Link>
              <p>{category.description || 'No description available.'}</p>
            </li>
          ))}
        </ul>
      )}
      {/* Basic styling (can be moved to CSS file) */}
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
