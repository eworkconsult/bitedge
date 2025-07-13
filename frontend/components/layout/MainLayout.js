import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './MainLayout.css'; // For layout-specific styles

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content container"> {/* Added container class for centering/padding */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
