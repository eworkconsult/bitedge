import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css'; // Next.js requires a global CSS import here

export const metadata = {
  title: 'Bitedge Network',
  description: 'The Go-To Hub for Everything Crypto',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="main-layout">
            <Navbar />
            <main className="main-content container">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
