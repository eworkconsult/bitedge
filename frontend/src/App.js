import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import ForumPage from './pages/ForumPage';
import TopicPage from './pages/TopicPage';
import NotFoundPage from './pages/NotFoundPage';
// import { AuthProvider } from './contexts/AuthContext'; // To be created

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
          {/* Or nested: /categories/:categorySlug/:forumSlug */}
          <Route path="/forums/:forumSlug" element={<MainLayout><ForumPage /></MainLayout>} />

          {/* Example topic route: /topics/my-first-topic-slug */}
          <Route path="/topics/:topicSlug" element={<MainLayout><TopicPage /></MainLayout>} />

          <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
        </Routes>
      </Router>
    // </AuthProvider>
  );
}

export default App;
