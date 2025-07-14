import React from 'react';
import Link from 'next/link';
import AdminRoute from '../../components/auth/AdminRoute';
// import './AdminLayout.css'; // For admin-specific layout styles

const AdminLayout = ({ children }) => {
  return (
    <AdminRoute>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h3>Admin Menu</h3>
          <nav>
            <ul>
              <li><Link href="/admin">Dashboard</Link></li>
              <li><Link href="/admin/advertisements">Manage Ads</Link></li>
              <li><Link href="/admin/users">Manage Users</Link></li>
              {/* Add more admin links here */}
            </ul>
          </nav>
        </aside>
        <main className="admin-content">
          {children}
        </main>
      </div>
      <style jsx>{`
        .admin-layout {
          display: flex;
          gap: 20px;
        }
        .admin-sidebar {
          width: 200px;
          flex-shrink: 0;
          background-color: #f8f9fa;
          padding: 15px;
          border-right: 1px solid #ddd;
        }
        .admin-sidebar h3 {
          margin-top: 0;
        }
        .admin-sidebar ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .admin-sidebar li {
          margin-bottom: 10px;
        }
        .admin-content {
          flex-grow: 1;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
        }
      `}</style>
    </AdminRoute>
  );
};

export default AdminLayout;
