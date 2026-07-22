import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Grid, Paper, Card, CardContent, Avatar, CircularProgress, Chip, Stack
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DnsIcon from '@mui/icons-material/Dns';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import api from '../../api/axiosConfig';

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalLogs: number;
    totalUtilityBills: number;
    recentLogs: any[];
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all data concurrently for maximum speed
                const [usersRes, logsRes, utilitiesRes] = await Promise.all([
                    api.get('/api/v1/admin/users'),
                    api.get('/api/v1/admin/logs'),
                    api.get('/api/v1/admin/utilities')
                ]);

                const users = usersRes.data;
                const logs = logsRes.data;
                const utilities = utilitiesRes.data;

                setStats({
                    totalUsers: users.length,
                    activeUsers: users.filter((u: any) => u.isActive).length,
                    totalLogs: logs.length,
                    totalUtilityBills: utilities.length,
                    recentLogs: logs.slice(0, 5) // Grab only the 5 most recent logs
                });
            } catch (error) {
                console.error("Failed to fetch global dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress size={60} sx={{ color: '#0f172a' }} />
            </Box>
        );
    }

    const summaryCards = [
        {
            title: 'TOTAL USERS',
            value: stats?.totalUsers || 0,
            subtitle: `${stats?.activeUsers || 0} Active`,
            icon: <PeopleIcon fontSize="large" />,
            bgColor: '#eff6ff',
            iconColor: '#3b82f6',
        },
        {
            title: 'UTILITY BILLS',
            value: stats?.totalUtilityBills || 0,
            subtitle: 'Recorded Months',
            icon: <ReceiptIcon fontSize="large" />,
            bgColor: '#f0fdf4',
            iconColor: '#22c55e',
        },
        {
            title: 'MICROSERVICES',
            value: 6,
            subtitle: 'All Systems Online',
            icon: <DnsIcon fontSize="large" />,
            bgColor: '#f8fafc',
            iconColor: '#0f172a',
        },
        {
            title: 'ACTIVE MODULES',
            value: 4,
            subtitle: 'Operational Departments',
            icon: <ViewModuleIcon fontSize="large" />,
            bgColor: '#fff7ed',
            iconColor: '#f97316',
        }
    ];

    const systemInfo = [
        { label: 'API Gateway Status', value: 'Connected (Port 8080)' },
        { label: 'Eureka Server Status', value: 'Online (Port 8761)' },
        { label: 'PostgreSQL Database Status', value: 'Connected' },
        { label: 'Docker Environment', value: 'Running' },
        { label: 'Frontend Status', value: 'Active' },
    ];

    const serviceHealth = [
        { name: 'API Gateway', status: 'Online' },
        { name: 'Auth Service', status: 'Online' },
        { name: 'Admin Service', status: 'Running' },
        { name: 'Milk Shop Service', status: 'Running' },
        { name: 'Room Section Service', status: 'Online' },
        { name: 'Beer Garden Service', status: 'Online' },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
            {/* Header Area */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 4, gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1e293b' }}>
                        Global Command Center
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        System overview and operational control dashboard.
                    </Typography>
                </Box>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {summaryCards.map((card, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card sx={{ 
                            height: '100%', 
                            borderRadius: 3, 
                            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                                <Avatar sx={{ bgcolor: card.bgColor, color: card.iconColor, width: 60, height: 60, mr: 2.5 }}>
                                    {card.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="overline" sx={{ fontWeight: 700, color: '#64748b', lineHeight: 1.2, display: 'block', mb: 0.5 }}>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.25 }}>
                                        {card.value}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                                        {card.subtitle}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Additional Content & System Info */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
                            Service Health Overview
                        </Typography>
                        <Grid container spacing={2}>
                            {serviceHealth.map((service, idx) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                                    <Box sx={{ 
                                        p: 2, 
                                        borderRadius: 2, 
                                        border: '1px solid #e2e8f0', 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        bgcolor: '#f8fafc'
                                    }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                            {service.name}
                                        </Typography>
                                        <Chip 
                                            label={service.status} 
                                            size="small"
                                            sx={{ 
                                                bgcolor: '#dcfce7', 
                                                color: '#166534', 
                                                fontWeight: 700,
                                                fontSize: '0.75rem'
                                            }} 
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', height: '100%', bgcolor: '#0f172a', color: 'white' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#f8fafc' }}>
                            System Information
                        </Typography>
                        <Stack spacing={2.5}>
                            {systemInfo.map((info, idx) => (
                                <Box key={idx}>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                                        {info.label}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4ade80' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                                            {info.value}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;