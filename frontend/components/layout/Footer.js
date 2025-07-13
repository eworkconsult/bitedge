import React from 'react';
import './Footer.css'; // For Footer specific styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Bitedge Network. All rights reserved.</p>
        {/* Add more links or info here */}
      </div>
    </footer>
  );
};

export default Footer;
