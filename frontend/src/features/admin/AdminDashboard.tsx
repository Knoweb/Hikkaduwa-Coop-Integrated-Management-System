import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Grid, Paper, Card, CardContent, Avatar, CircularProgress, Chip, Stack, Button, Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalLogs: number;
    totalUtilityBills: number;
    recentLogs: any[];
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
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
                    recentLogs: logs.slice(0, 5)
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
                <CircularProgress size={60} sx={{ color: '#b91c1c' }} />
            </Box>
        );
    }

    const summaryCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, subtitle: `${stats?.activeUsers || 0} Active Accounts`, icon: <PeopleIcon fontSize="large" />, bgColor: '#fff7ed', iconColor: '#ea580c' },
        { title: 'Active Departments', value: 3, subtitle: 'Milk Shop, Room, Beer', icon: <ViewModuleIcon fontSize="large" />, bgColor: '#fef2f2', iconColor: '#dc2626' },
        { title: 'Utility Allocations', value: stats?.totalUtilityBills || 0, subtitle: 'Recorded Statements', icon: <ReceiptIcon fontSize="large" />, bgColor: '#f0fdf4', iconColor: '#16a34a' },
        { title: 'Operational Records', value: stats?.totalLogs || 0, subtitle: 'Total System Audits', icon: <NotificationsActiveIcon fontSize="large" />, bgColor: '#eff6ff', iconColor: '#2563eb' }
    ];

    const departmentCards = [
        { name: 'Milk Shop Management', desc: 'Manage suppliers, GRNs, stock ledger, and daily cash handovers.', icon: <StorefrontIcon fontSize="large" />, color: '#ea580c' },
        { name: 'Room Section Management', desc: 'Oversee room bookings, occupancy matrix, and daily remittances.', icon: <HotelIcon fontSize="large" />, color: '#0284c7' },
        { name: 'Beer Garden Management', desc: 'Track liquor issuance, supplier payments, and bar commissions.', icon: <LocalBarIcon fontSize="large" />, color: '#16a34a' }
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
            {/* 1. Welcome Header */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 4, gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, color: '#1e293b' }}>
                        Coop Administration Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        Central overview of cooperative business operations
                    </Typography>
                </Box>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Typography variant="body1" color="text.secondary">
                        {currentDate}
                    </Typography>
                </Box>
            </Box>

            {/* 2. Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {summaryCards.map((card, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                                <Avatar sx={{ bgcolor: card.bgColor, color: card.iconColor, width: 60, height: 60, mr: 2.5 }}>
                                    {card.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="overline" sx={{ fontWeight: 700, color: '#64748b', display: 'block', mb: 0.5 }}>{card.title}</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>{card.value}</Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>{card.subtitle}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 3. Department Module Cards & 4. Admin Quick Actions */}
            <Grid container spacing={4} sx={{ mb: 5 }}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>Business Departments</Typography>
                    <Grid container spacing={2}>
                        {departmentCards.map((dept, idx) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                                <Card sx={{ borderRadius: 3, borderLeft: `6px solid ${dept.color}`, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }, height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Box sx={{ color: dept.color, mr: 1.5, display: 'flex' }}>{dept.icon}</Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{dept.name}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, minHeight: 40 }}>{dept.desc}</Typography>
                                        <Chip label="Operational" size="small" sx={{ bgcolor: `${dept.color}15`, color: dept.color, fontWeight: 700, fontSize: '0.75rem' }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>Quick Actions</Typography>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', height: '100%' }}>
                        <Stack spacing={2}>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/users')} sx={{ bgcolor: '#b91c1c', '&:hover': { bgcolor: '#991b1b' }, justifyContent: 'flex-start', py: 1.5 }}>
                                Add New User
                            </Button>
                            <Button variant="outlined" startIcon={<ReceiptIcon />} onClick={() => navigate('/admin/utilities')} sx={{ color: '#b91c1c', borderColor: '#b91c1c', '&:hover': { bgcolor: '#fef2f2', borderColor: '#b91c1c' }, justifyContent: 'flex-start', py: 1.5 }}>
                                Manage Utility Bills
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* 5. Operational Overview & 6. Alerts / Notes */}
            <Grid container spacing={4} sx={{ mb: 5 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3, display: 'flex', alignItems: 'center' }}>
                            <SettingsIcon sx={{ mr: 1, color: '#b91c1c' }} /> Operational Overview
                        </Typography>
                        <Stack spacing={2}>
                            <Typography variant="body2"><strong>Milk Shop:</strong> Monitor daily sales tracking and physical stock discrepancies.</Typography>
                            <Divider />
                            <Typography variant="body2"><strong>Room Section:</strong> Check room bookings, guest check-outs, and daily remittance tracking.</Typography>
                            <Divider />
                            <Typography variant="body2"><strong>Beer Garden:</strong> Review liquor issuance, bar commissions, and supplier payment cycles.</Typography>
                            <Divider />
                            <Typography variant="body2"><strong>Utility Allocation:</strong> Ensure precise ratio distribution of electricity and water bills.</Typography>
                            <Divider />
                            <Typography variant="body2"><strong>User Roles:</strong> Manage system access levels and enforce strict department boundaries.</Typography>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', height: '100%', bgcolor: '#fff7ed' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#9a3412', mb: 3, display: 'flex', alignItems: 'center' }}>
                            <WarningAmberIcon sx={{ mr: 1 }} /> Admin Reminders
                        </Typography>
                        <Stack spacing={2.5}>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ea580c', mt: 0.8 }} />
                                <Typography variant="body2" sx={{ color: '#7c2d12' }}>Check daily cash handover records against physical cash collected.</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ea580c', mt: 0.8 }} />
                                <Typography variant="body2" sx={{ color: '#7c2d12' }}>Review room remittance reports at the end of each receptionist shift.</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ea580c', mt: 0.8 }} />
                                <Typography variant="body2" sx={{ color: '#7c2d12' }}>Verify utility allocations monthly before submitting final ledger reports.</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ea580c', mt: 0.8 }} />
                                <Typography variant="body2" sx={{ color: '#7c2d12' }}>Monitor stock and sales summaries to ensure reorder levels are maintained.</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* 7. Technical Status (Small, simple) */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>SYSTEM STATUS:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Backend Services: Online</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Database: Connected</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Frontend: Active</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;