import React from 'react';
import Link from 'next/link';
import apiService from '../../../services/api'; // Adjust path due to nesting
import { notFound } from 'next/navigation'; // For handling 404

export async function generateMetadata({ params }) {
  const { categorySlug } = params;
  try {
    const category = await getCategoryDetails(categorySlug);
    return {
      title: `${category.name} - Bitedge Network`,
      description: category.description || `Forums and discussions in the ${category.name} category.`,
    };
  } catch (error) {
    return {
      title: 'Category Not Found',
      description: 'The category you are looking for does not exist.',
    };
  }
}

async function getCategoryDetails(slug) {
  try {
    const response = await apiService.fetchCategoryDetails(slug);
    return response.data;
  } catch (error) {
    // If API returns 404 or another error, we can trigger Next.js's not found page
    if (error.response && error.response.status === 404) {
      notFound();
    }
    // For other errors, you might want to log them and still show a not found or error state
    console.error(`Failed to fetch category ${slug}:`, error);
    notFound();
  }
}

// This is the page component
const CategoryPage = async ({ params }) => {
  const { categorySlug } = params;
  const category = await getCategoryDetails(categorySlug);

  return (
    <div className="category-page">
      <h1>{category.name}</h1>
      <p>{category.description || 'No description for this category.'}</p>

      <h3>Forums in this category:</h3>
      {category.forums && category.forums.length > 0 ? (
        <ul className="forum-list">
          {category.forums.map(forum => (
            <li key={forum.id} className="forum-item">
              <Link href={`/forums/${forum.slug}`}>
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
