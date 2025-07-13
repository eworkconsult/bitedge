import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiService from '../services/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        setError('');
        // This will be a new method in our apiService
        const response = await apiService.search(query);
        setResults(response.data.results);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || `Failed to search for "${query}".`);
        console.error("Error performing search:", err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="search-page">
      <h1>Search Results</h1>
      {query ? (
        <p>Showing results for: <strong>{query}</strong></p>
      ) : (
        <p>Please enter a search term in the search bar above.</p>
      )}

      {loading && <p>Searching...</p>}
      {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}

      {!loading && !error && (
        <>
          {results.length > 0 ? (
            <div className="search-results-list">
              {results.map(topic => (
                <div key={topic.id} className="search-result-item">
                  <h4><Link to={`/topics/${topic.slug}`}>{topic.title}</Link></h4>
                  <small>
                    In forum: <Link to={`/forums/${topic.forum?.slug}`}>{topic.forum?.name || 'N/A'}</Link>
                    {' | '}
                    By: <Link to={`/users/${topic.user?.username}`}>{topic.user?.username || 'N/A'}</Link>
                  </small>
                  {/* Optionally, the backend could return a snippet of the matching post */}
                </div>
              ))}
            </div>
          ) : (
            query && <p>No results found for "{query}".</p>
          )}
          {/* TODO: Add pagination controls */}
        </>
      )}

      <style jsx>{`
        .search-results-list {
          margin-top: 20px;
        }
        .search-result-item {
          background-color: #fff;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin-bottom: 15px;
        }
        .search-result-item h4 {
          margin: 0 0 10px 0;
        }
        .search-result-item small {
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default SearchPage;
