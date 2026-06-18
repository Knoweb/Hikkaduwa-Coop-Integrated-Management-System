import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import api from '../../api/axiosConfig';

interface BeerPrice {
    id: string;
    beerName: string;
    unitPrice: number;
    effectiveDate: string;
}

const PriceMatrix: React.FC = () => {
    const [prices, setPrices] = useState<BeerPrice[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedBeer, setSelectedBeer] = useState('');
    const [newPrice, setNewPrice] = useState<number | string>('');
    const [isNewProduct, setIsNewProduct] = useState(false);
    
    // Aluth State eka Search eka handle karanna
    const [searchText, setSearchText] = useState('');

    const fetchPrices = async () => {
        try {
            const response = await api.get<BeerPrice[]>('/api/v1/beer-garden/prices');
            setPrices(response.data);
        } catch (error) {
            console.error("Failed to load prices:", error);
        }
    };

    useEffect(() => { fetchPrices(); }, []);

    const handleUpdate = async () => {
        if (!selectedBeer.trim() || !newPrice) return;
        await api.post('/api/v1/beer-garden/prices', {
            beerName: selectedBeer,
            unitPrice: Number(newPrice)
        });
        setOpen(false);
        fetchPrices();
    };

    const userRole = localStorage.getItem('user_role');

    const columns: GridColDef[] = [
        { field: 'beerName', headerName: 'Beer Name', flex: 2, sortable: true },
        { 
            field: 'unitPrice', 
            headerName: 'Unit Price (Rs.)', 
            flex: 1, 
            type: 'number',
            sortable: true,
            valueFormatter: (value) => value ? Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"
        },
        { field: 'effectiveDate', headerName: 'Effective Date', flex: 1, sortable: true },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                userRole === 'ROLE_ADMIN' ? (
                    <Button variant="outlined" color="warning" size="small" onClick={() => { 
                        setIsNewProduct(false); setSelectedBeer(params.row.beerName); setNewPrice(params.row.unitPrice); setOpen(true); 
                    }}>
                        Revise
                    </Button>
                ) : <Typography variant="caption">View Only</Typography>
            )
        }
    ];

    // Meken Data array eka real-time filter karanawa search box eke type karana akuru anuwa
    const filteredPrices = prices.filter((beer) => 
        beer.beerName.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Box sx={{ padding: 3, height: 600, width: '100%' }}>
            <Stack direction="row" sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#451a03' }}>Beer Pricing Matrix</Typography>
                
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    {/* Hamotama penena Custom Search Bar eka */}
                    <TextField
                        size="small"
                        placeholder="Search Beer Name..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        sx={{ width: '250px', backgroundColor: 'white', borderRadius: 1 }}
                    />

                    {/* Admin ta witharak penena Add Button eka */}
                    {userRole === 'ROLE_ADMIN' && (
                        <Button variant="contained" sx={{ backgroundColor: '#1e40af', height: '40px' }} onClick={() => { setIsNewProduct(true); setSelectedBeer(''); setNewPrice(''); setOpen(true); }}>
                            + Add New Product
                        </Button>
                    )}
                </Stack>
            </Stack>
            
            <DataGrid 
                rows={filteredPrices} // Original array eka wenuwata Filter karapu array eka pass karanawa
                columns={columns} 
                slots={{ toolbar: GridToolbar }} 
                initialState={{ sorting: { sortModel: [{ field: 'beerName', sort: 'asc' }] } }}
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{isNewProduct ? 'Add New Beer Product' : 'Revise Unit Price'}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2, mt: 1 }}>{isNewProduct ? 'Add product details below.' : 'Update current price.'}</DialogContentText>
                    <TextField fullWidth label="Beer Name" value={selectedBeer} onChange={(e) => setSelectedBeer(e.target.value)} disabled={!isNewProduct} sx={{ mb: 2 }} />
                    <TextField fullWidth type="number" label="Unit Price (Rs.)" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained" color={isNewProduct ? "primary" : "warning"}>
                        {isNewProduct ? 'Save' : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PriceMatrix;