import React from 'react';

const BeerGardenDashboard: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ color: '#0f172a', marginBottom: '16px' }}>Beer Garden Logistics</h1>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <p>Welcome to the Beer Garden Dashboard. Liquor issuance, commission tracking, and active price lists will be displayed here.</p>
            </div>
        </div>
    );
};

export default BeerGardenDashboard;