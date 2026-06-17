import React from 'react';

const AdminDashboard: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ color: '#0f172a', marginBottom: '16px' }}>Global Admin Dashboard</h1>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <p>Welcome to the System Administration Portal. Overview of all cooperative branches, user management, and global metrics will appear here.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;