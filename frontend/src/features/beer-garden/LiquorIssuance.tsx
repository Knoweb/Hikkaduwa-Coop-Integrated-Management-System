import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Divider } from '@mui/material';
// Ensure you have @mui/icons-material installed (npm install @mui/icons-material)
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axiosConfig';

// Types
interface BeerPrice {
    id: string;
    beerName: string;
    unitPrice: number;
}

interface CartItem {
    beerName: string;
    unitPrice: number;
    quantity: number;
    subTotal: number;
}

const LiquorIssuance: React.FC = () => {
    // State for available prices
    const [availableBeers, setAvailableBeers] = useState<BeerPrice[]>([]);
    
    // State for the current input form
    const [selectedBeer, setSelectedBeer] = useState<string>('');
    const [quantity, setQuantity] = useState<number | string>('');
    
    // State for the Invoice Cart
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Fetch available active prices from the database
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await api.get<BeerPrice[]>('/api/v1/beer-garden/prices');
                setAvailableBeers(response.data);
            } catch (error) {
                console.error("Failed to load beer prices:", error);
            }
        };
        fetchPrices();
    }, []);

    // 2. Add an item to the cart
    const handleAddToCart = () => {
        if (!selectedBeer || !quantity || Number(quantity) <= 0) return;

        const beerDetails = availableBeers.find(b => b.beerName === selectedBeer);
        if (!beerDetails) return;

        const newItem: CartItem = {
            beerName: beerDetails.beerName,
            unitPrice: beerDetails.unitPrice,
            quantity: Number(quantity),
            subTotal: beerDetails.unitPrice * Number(quantity)
        };

        setCartItems([...cartItems, newItem]);
        
        // Reset form
        setSelectedBeer('');
        setQuantity('');
    };

    // 3. Remove an item from the cart
    const handleRemoveItem = (index: number) => {
        const newCart = cartItems.filter((_, i) => i !== index);
        setCartItems(newCart);
    };

    // 4. Calculate Grand Total dynamically
    const grandTotal = cartItems.reduce((sum, item) => sum + item.subTotal, 0);

    // 5. Submit the Invoice to the Backend
   const handleSubmitInvoice = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    try {
        await api.post('/api/v1/beer-garden/issuances', {
            // Frontend eke me data tikath capture karanna (ona nam inputs hadanna)
            restaurantId: '550e8400-e29b-41d4-a716-446655440000', // Hardcoded for now, or get from login
            restaurantOperatorName: 'Default Operator', 
            priorityLevel: 'MEDIUM',
            items: cartItems.map(item => ({
                beerName: item.beerName,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            })),
            totalLiquorValue: grandTotal
        });

        alert("Liquor Issuance Created Successfully!");
        setCartItems([]);
    } catch (error: any) {
    console.error("Full Error Object:", error); // <-- Add this
    const errorMessage = error.response?.data?.message || "Check the console for details.";
    alert("Error creating issuance: " + errorMessage); // <-- This will show the actual reason

    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#451a03' }}>
                Liquor Issuance (F16 B)
            </Typography>

            <Grid container spacing={4}>
                {/* LEFT SIDE: Entry Form */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Add Items</Typography>
                            
                            <TextField
                                select
                                fullWidth
                                label="Select Beer"
                                value={selectedBeer}
                                onChange={(e) => setSelectedBeer(e.target.value)}
                                sx={{ mb: 3 }}
                            >
                                {availableBeers.map((beer) => (
                                    <MenuItem key={beer.id} value={beer.beerName}>
                                        {beer.beerName} (Rs. {beer.unitPrice})
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                type="number"
                                label="Quantity (Bottles/Cans)"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                sx={{ mb: 3 }}
                            />

                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                sx={{ backgroundColor: '#f97316', '&:hover': { backgroundColor: '#ea580c' }, py: 1.5 }}
                                onClick={handleAddToCart}
                                disabled={!selectedBeer || !quantity}
                            >
                                Add to Issuance
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* RIGHT SIDE: Cart / Invoice Preview */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Current Invoice Preview</Typography>
                            
                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', mb: 3 }}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableRow>
                                            <TableCell>Beer Name</TableCell>
                                            <TableCell align="right">Unit Price</TableCell>
                                            <TableCell align="right">Qty</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cartItems.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                                                    No items added yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {cartItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{item.beerName}</TableCell>
                                                <TableCell align="right">Rs. {item.unitPrice.toLocaleString()}</TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rs. {item.subTotal.toLocaleString()}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="error" size="small" onClick={() => handleRemoveItem(index)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ mr: 2 }}>Total Value:</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b91c1c' }}>
                                    Rs. {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Button 
                                variant="contained" 
                                color="success" 
                                size="large" 
                                fullWidth
                                disabled={cartItems.length === 0 || isSubmitting}
                                onClick={handleSubmitInvoice}
                                sx={{ py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
                            >
                                {isSubmitting ? 'Processing...' : 'CONFIRM & ISSUE LIQUOR'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LiquorIssuance;