'use client';

import React from 'react';
import { useRouter }from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated || !user?.isAdmin) {
    // Redirect them to the home page if they are not an admin.
    // Or to a specific "access denied" page.
    // Using router.push in a client component requires useEffect to prevent
    // rendering during server-side builds or static generation.
    // However, for a simple redirect like this, it's often acceptable.
    // A more robust solution might involve middleware in Next.js.

    // For simplicity here, we'll just return null or a message,
    // and rely on a useEffect to push the route.
    React.useEffect(() => {
        if (!loading) {
            router.push('/');
        }
    }, [loading, isAuthenticated, user, router]);

    return <p>Access Denied. Redirecting...</p>;
  }

  return children;
};

export default AdminRoute;
