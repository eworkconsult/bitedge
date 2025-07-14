import React from 'react';
import Link from 'next/link';
import apiService from '../../../services/api'; // Adjust path due to nesting
import { notFound } from 'next/navigation'; // For handling 404
import CategoryForumList from './CategoryForumList'; // The new client component

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

      <CategoryForumList initialCategory={category} />
    </div>
  );
};

export default CategoryPage;
