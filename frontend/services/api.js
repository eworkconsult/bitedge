import axios from 'axios';

// Determine the base URL for the API
// In development, this will typically be http://localhost:PORT_OF_BACKEND
// In production, this will be your actual deployed API URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or get from AuthContext
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// You can add interceptors for responses as well, e.g., to handle global errors
// apiClient.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized errors, e.g., redirect to login, clear token
//       console.error("Unauthorized request or token expired. Logging out.");
//       // localStorage.removeItem('authToken'); // Example
//       // window.location.href = '/login'; // Example
//     }
//     return Promise.reject(error);
//   }
// );


// Export specific API functions or the configured apiClient itself

// Example function for user login (can be in a more specific authService.js)
export const loginUser = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

export const registerUser = (userData) => {
  return apiClient.post('/auth/register', userData);
};

// Example for categories
export const fetchCategories = () => {
  return apiClient.get('/categories');
};

export const fetchCategoryDetails = (slug) => {
  return apiClient.get(`/categories/${slug}`);
};


// Export the configured instance if you prefer to use it directly in components/pages
// export default apiClient;

// Or export specific service modules
// e.g., authService.js, categoryService.js that use this apiClient
export default {
    apiClient, // Expose the raw client if needed
    // Auth
    loginUser,
    registerUser,
    // Categories
    fetchCategories,
    fetchCategoryDetails,
    // Add more functions for forums, topics, posts as they are built
    fetchForumDetails: (slug) => apiClient.get(`/forums/${slug}`),
    fetchTopicDetails: (slug) => apiClient.get(`/topics/${slug}`),
    createTopic: (forumSlug, data) => apiClient.post(`/forums/${forumSlug}/topics`, data),
    createPost: (topicSlug, data) => apiClient.post(`/topics/${topicSlug}/posts`, data),
    updatePost: (postId, data) => apiClient.put(`/posts/${postId}`, data),
    deletePost: (postId) => apiClient.delete(`/posts/${postId}`),
    updateTopic: (topicSlug, data) => apiClient.put(`/topics/${topicSlug}`, data),
    deleteTopic: (topicSlug) => apiClient.delete(`/topics/${topicSlug}`),
    // Users
    fetchUserProfile: (username) => apiClient.get(`/users/${username}`),
    updateUserProfile: (data) => apiClient.put('/users/me/profile', data),
    // Search
    search: (query) => apiClient.get(`/search?q=${encodeURIComponent(query)}`),
    // Advertisements (Admin)
    listAdvertisements: () => apiClient.get('/advertisements'),
    createAdvertisement: (data) => apiClient.post('/advertisements', data),
    updateAdvertisement: (id, data) => apiClient.put(`/advertisements/${id}`, data),
    deleteAdvertisement: (id) => apiClient.delete(`/advertisements/${id}`),
    // Ads (Public)
    fetchActiveAds: (page_type, identifier) => {
        const params = new URLSearchParams({ page_type });
        if (identifier) {
            params.append('identifier', identifier);
        }
        return apiClient.get(`/ads?${params.toString()}`);
    },
};
