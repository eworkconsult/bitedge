import React from 'react';
import Link from 'next/link';
import apiService from '../../../services/api';
import { notFound } from 'next/navigation';
// Note: Auth logic will need to be handled differently.
import React from 'react';
import Link from 'next/link';
import apiService from '../../../services/api';
import { notFound } from 'next/navigation';
import ForumTopicList from './ForumTopicList'; // The new client component

export async function generateMetadata({ params }) {
  const { forumSlug } = params;
  try {
    const forum = await getForumDetails(forumSlug);
    return {
      title: `${forum.name} - Bitedge Network`,
      description: forum.description || `Discussions in the ${forum.name} forum.`,
    };
  } catch (error) {
    return {
      title: 'Forum Not Found',
      description: 'The forum you are looking for does not exist.',
    };
  }
}

async function getForumDetails(slug) {
  try {
    const response = await apiService.fetchForumDetails(slug);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) notFound();
    console.error(`Failed to fetch forum ${slug}:`, error);
    notFound();
  }
}

const ForumPage = async ({ params }) => {
  const { forumSlug } = params;
  const forum = await getForumDetails(forumSlug);

  return (
    <div className="forum-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{forum.name}</h1>
        {/* The "Create Topic" button is now inside ForumTopicList */}
      </div>
      <p><Link href={`/categories/${forum.category?.slug}`}>Back to {forum.category?.name || 'Category'}</Link></p>
      <p>{forum.description || 'No description for this forum.'}</p>

      <ForumTopicList initialForum={forum} />
    </div>
  );
};

export default ForumPage;
