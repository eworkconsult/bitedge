import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import ForumPage from './pages/ForumPage';
import TopicPage from './pages/TopicPage';
import CreateTopicPage from './pages/CreateTopicPage'; // Import the new page
import NotFoundPage from './pages/NotFoundPage';
// import { AuthProvider } from './contexts/AuthContext'; // To be created
import ProtectedRoute from './components/auth/ProtectedRoute';

import './App.css'; // Default CRA styles, can be customized

function App() {
  return (
    // <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
          <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />

          {/* Example category route: /categories/crypto-news */}
          <Route path="/categories/:categorySlug" element={<MainLayout><CategoryPage /></MainLayout>} />

          {/* Example forum route: /forums/bitcoin-discussion */}
          <Route path="/forums/:forumSlug" element={<MainLayout><ForumPage /></MainLayout>} />

          {/* Protected route for creating a new topic */}
          <Route
            path="/forums/:forumSlug/create-topic"
            element={
              <ProtectedRoute>
                <MainLayout><CreateTopicPage /></MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Example topic route: /topics/my-first-topic-slug */}
          <Route path="/topics/:topicSlug" element={<MainLayout><TopicPage /></MainLayout>} />

          <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
        </Routes>
      </Router>
    // </AuthProvider>
  );
}

export default App;
