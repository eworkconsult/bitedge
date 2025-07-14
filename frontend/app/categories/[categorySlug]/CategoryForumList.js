'use client';

import React from 'react';
import Link from 'next/link';
import useAds from '../../../hooks/useAds';
import AdSlot from '../../../components/ads/AdSlot';

const CategoryForumList = ({ initialCategory }) => {
  const { ads } = useAds('category', initialCategory.slug);

  return (
    <>
      {/* Header Ads */}
      {ads.header && ads.header.map((adCode, index) => (
        <AdSlot key={`header-ad-${index}`} adCode={adCode} />
      ))}

      <h3>Forums in this category:</h3>
      {initialCategory.forums && initialCategory.forums.length > 0 ? (
        <ul className="forum-list">
          {initialCategory.forums.map(forum => (
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

      {/* Styles from original CategoryPage.js */}
      <style jsx>{`
        .forum-list { list-style: none; padding: 0; }
        .forum-item { background-color: #f9f9f9; border: 1px solid #eee; border-radius: 4px; padding: 10px 15px; margin-bottom: 10px; }
        .forum-item h4 { margin-top: 0; margin-bottom: 0.3rem; }
        .forum-item a { text-decoration: none; color: inherit; }
        .forum-item a:hover h4 { color: #0056b3; }
        .forum-item p { font-size: 0.9rem; color: #666; margin-bottom: 0.25rem; }
        .forum-item small { font-size: 0.8rem; color: #777; }
      `}</style>
    </>
  );
};

export default CategoryForumList;
