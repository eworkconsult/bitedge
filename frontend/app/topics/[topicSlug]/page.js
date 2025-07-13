import React from 'react';
import Link from 'next/link';
import apiService from '../../../services/api';
import { notFound } from 'next/navigation';
import PostList from './PostList'; // A new client component

export async function generateMetadata({ params }) {
  const { topicSlug } = params;
  try {
    const topic = await getTopicDetails(topicSlug);
    // Generate a short description from the first post's content
    const description = topic.posts?.[0]?.content.substring(0, 155).replace(/<[^>]*>?/gm, '') + '...' || 'Join the discussion.';
    return {
      title: `${topic.title} - Bitedge Network`,
      description: description,
    };
  } catch (error) {
    return {
      title: 'Topic Not Found',
      description: 'The topic you are looking for does not exist.',
    };
  }
}

async function getTopicDetails(slug) {
  try {
    const response = await apiService.fetchTopicDetails(slug);
    // The view count increment was in the old component.
    // In Next.js, this is more complex. A separate API call from a client component
    // or a backend route middleware is a better approach. For now, we omit it.
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) notFound();
    console.error(`Failed to fetch topic ${slug}:`, error);
    notFound();
  }
}

const TopicPage = async ({ params }) => {
  const { topicSlug } = params;
  const topic = await getTopicDetails(topicSlug);

  return (
    <div className="topic-page">
      <h1>{topic.title}</h1>
      <p>
        In <Link href={`/forums/${topic.forum?.slug}`}>{topic.forum?.name || 'Forum'}</Link>
        {' > '}
        <Link href={`/categories/${topic.forum?.category?.slug}`}>{topic.forum?.category?.name || 'Category'}</Link>
      </p>
      <p>
        Started by: <Link href={`/users/${topic.user?.username}`}>{topic.user?.username || 'Unknown'}</Link> on {new Date(topic.createdAt).toLocaleString()}
      </p>

      {/* Pass initial data to the client component */}
      <PostList initialTopic={topic} />

      {/* Basic styling */}
      <style jsx>{`
        .topic-page {
          /* Add styles for the main topic page container if needed */
        }
      `}</style>
    </div>
  );
};

export default TopicPage;
