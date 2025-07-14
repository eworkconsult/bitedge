import React from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const NotificationsLayout = ({ children }) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default NotificationsLayout;
