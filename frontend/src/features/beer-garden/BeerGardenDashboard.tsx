import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '../../api/axiosConfig'; 

interface IssuanceInvoice {
    id: string;
    totalLiquorValue: number;
    commissionTotal: number;
    grandTotal: number;
    status: string;
    issuedDate: string;
}

const BeerGardenDashboard: React.FC = () => {
    const [invoices, setInvoices] = useState<IssuanceInvoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchReceivables = async () => {
            try {
                const response = await api.get<IssuanceInvoice[]>('/api/v1/beer-garden/receivables?status=UNPAID');
                setInvoices(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to connect to the Beer Garden Service.');
            } finally {
                setLoading(false);
            }
        };

        fetchReceivables();
    }, []);

    const totalExposure = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

    return (
        <Box sx={{ padding: '24px' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#451a03', mb: 4 }}>
                Logistics & Receivables Dashboard
            </Typography>

            {/* KPI Cards Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderLeft: '6px solid #ef4444', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                TOTAL CREDIT EXPOSURE (UNPAID)
                            </Typography>
                            {loading ? <CircularProgress size={24} /> : (
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b91c1c' }}>
                                    Rs. {totalExposure.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderLeft: '6px solid #f59e0b', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                PENDING INVOICES
                            </Typography>
                            {loading ? <CircularProgress size={24} /> : (
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d97706' }}>
                                    {invoices.length}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Error Handling */}
            {error && (
                <Box sx={{ p: 2, mb: 3, backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: 1 }}>
                    {error}
                </Box>
            )}

            {/* Accounts Receivable Data Table */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#451a03', mb: 2 }}>
                Active Receivables Ledger
            </Typography>
            
            <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Invoice ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Issued Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Liquor Value</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Commission</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Grand Total</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                    No unpaid invoices found.
                                </TableCell>
                            </TableRow>
                        )}
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '13px' }}>
                                    {invoice.id.split('-')[0].toUpperCase()}...
                                </TableCell>
                                <TableCell>
                                    {new Date(invoice.issuedDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="right">Rs. {invoice.totalLiquorValue.toLocaleString()}</TableCell>
                                <TableCell align="right">Rs. {invoice.commissionTotal.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                    Rs. {invoice.grandTotal.toLocaleString()}
                                </TableCell>
                                <TableCell align="center">
                                    <Chip 
                                        label={invoice.status} 
                                        size="small" 
                                        color={invoice.status === 'UNPAID' ? 'error' : 'warning'} 
                                        variant="outlined" 
                                        sx={{ fontWeight: 'bold' }} 
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BeerGardenDashboard;