import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import api from '../../api/axiosConfig';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import HotelIcon from '@mui/icons-material/Hotel';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import AssessmentIcon from '@mui/icons-material/Assessment';

const AuditorDashboard: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        users: 0,
        milkSuppliers: 0,
        rooms: 0,
        beerSuppliers: 0,
        openObservations: 0,
        respondedObservations: 0,
        resolvedObservations: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                // We do a best-effort fetch of stats using existing APIs.
                const [
                    usersRes, 
                    milkSuppliersRes, 
                    roomsRes, 
                    beerSuppliersRes,
                    obsRes
                ] = await Promise.all([
                    api.get('/api/v1/admin/users').catch(() => ({ data: [] })),
                    api.get('/api/v1/milk-shop/suppliers').catch(() => ({ data: [] })),
                    api.get('/api/v1/rooms').catch(() => ({ data: [] })),
                    api.get('/api/v1/beer-garden/suppliers').catch(() => ({ data: [] })),
                    api.get('/api/v1/audit-observations').catch(() => ({ data: [] }))
                ]);

                const observations = obsRes.data;
                const openCount = observations.filter((o: any) => o.status === 'OPEN').length;
                const respondedCount = observations.filter((o: any) => o.status === 'RESPONDED').length;
                const resolvedCount = observations.filter((o: any) => o.status === 'RESOLVED').length;

                setStats({
                    users: usersRes.data.length || 0,
                    milkSuppliers: milkSuppliersRes.data.length || 0,
                    rooms: roomsRes.data.length || 0,
                    beerSuppliers: beerSuppliersRes.data.length || 0,
                    openObservations: openCount,
                    respondedObservations: respondedCount,
                    resolvedObservations: resolvedCount
                });
            } catch (error) {
                console.error("Failed to load auditor stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Registered Users', value: stats.users, icon: <AdminPanelSettingsIcon fontSize="large" color="primary" /> },
        { title: 'Milk Shop Suppliers', value: stats.milkSuppliers, icon: <LocalDrinkIcon fontSize="large" color="info" /> },
        { title: 'Total Rooms', value: stats.rooms, icon: <HotelIcon fontSize="large" color="secondary" /> },
        { title: 'Beer Suppliers', value: stats.beerSuppliers, icon: <SportsBarIcon fontSize="large" color="warning" /> },
    ];

    const obsCards = [
        { title: 'Open Observations', value: stats.openObservations, color: '#ef4444' },
        { title: 'Responded', value: stats.respondedObservations, color: '#f59e0b' },
        { title: 'Resolved', value: stats.resolvedObservations, color: '#10b981' },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                Auditor Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {obsCards.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={index}>
                        <Card sx={{ borderLeft: `6px solid ${stat.color}`, boxShadow: 2 }}>
                            <CardContent>
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    {stat.title}
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color }}>
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                System Overview
            </Typography>
            
            <Grid container spacing={3}>
                {statCards.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card sx={{ boxShadow: 1 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        {stat.title}
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                                {stat.icon}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AuditorDashboard;
