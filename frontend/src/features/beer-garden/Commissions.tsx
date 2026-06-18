import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import api from '../../api/axiosConfig';

interface Issuance {
    id: string;
    restaurantOperatorName: string;
    totalLiquorValue: number;
    commissionTotal: number;
    grandTotal: number;
    status: string;
}

const Commissions: React.FC = () => {
    const [data, setData] = useState<Issuance[]>([]);

    useEffect(() => {
        const fetchReceivables = async () => {
            try {
                // Backend eke liyapu API endpoint eka
                const response = await api.get('/api/v1/beer-garden/receivables?status=UNPAID');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchReceivables();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Commission Receivables</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                            <TableCell>Operator</TableCell>
                            <TableCell align="right">Liquor Value</TableCell>
                            <TableCell align="right">Commission</TableCell>
                            <TableCell align="right">Grand Total</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.restaurantOperatorName}</TableCell>
                                <TableCell align="right">Rs. {row.totalLiquorValue.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ color: 'green', fontWeight: 'bold' }}>Rs. {row.commissionTotal.toLocaleString()}</TableCell>
                                <TableCell align="right">Rs. {row.grandTotal.toLocaleString()}</TableCell>
                                <TableCell align="center">
                                    <Chip label={row.status} color="warning" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Commissions;