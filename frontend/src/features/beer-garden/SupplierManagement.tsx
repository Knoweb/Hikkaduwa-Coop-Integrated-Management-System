import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogContentText, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid'; // STRICT TYPE IMPORT
import api from '../../api/axiosConfig';


interface Supplier {
    id: string;
    supplierName: string;
    licenseNumber: string;
    territory: string;
    contactDetails: string;
    creditTerms: string;
    outstandingBalance: number;
}

const SupplierManagement: React.FC = () => {
    // Shared State
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    
    // Add Supplier State
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        supplierName: '', licenseNumber: '', territory: '', contactDetails: '', creditTerms: ''
    });

    // Payment Settlement State
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentRef, setPaymentRef] = useState('');

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/api/v1/beer-garden/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    useEffect(() => { fetchSuppliers(); }, []);

    // --- ADD SUPPLIER LOGIC ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async () => {
        if (!formData.supplierName) return alert("Supplier Name is required");
        setIsSubmitting(true);
        try {
            await api.post('/api/v1/beer-garden/suppliers', formData);
            setOpenAddDialog(false);
            setFormData({ supplierName: '', licenseNumber: '', territory: '', contactDetails: '', creditTerms: '' });
            fetchSuppliers(); 
        } catch (error) {
            console.error("Failed to add supplier:", error);
            alert("Error adding supplier. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- PAYMENT SETTLEMENT LOGIC ---
    const handleOpenPayment = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setPaymentAmount('');
        setPaymentRef('');
        setOpenPaymentDialog(true);
    };

    const handleProcessPayment = async () => {
        if (!selectedSupplier || !paymentAmount || Number(paymentAmount) <= 0) return alert("Enter a valid amount");

        try {
            await api.post('/api/v1/beer-garden/supplier-payments', {
                supplierId: selectedSupplier.id,
                amount: Number(paymentAmount),
                paymentReference: paymentRef
            });
            alert("Payment recorded successfully!");
            setOpenPaymentDialog(false);
            fetchSuppliers(); // Refresh table to show reduced debt!
        } catch (error) {
            console.error("Payment failed", error);
            alert("Failed to process payment.");
        }
    };

    // --- DATAGRID COLUMNS ---
    const columns: GridColDef[] = [
        { field: 'supplierName', headerName: 'Supplier Name', flex: 1.5, sortable: true },
        { field: 'contactDetails', headerName: 'Contact', flex: 1 },
        { field: 'creditTerms', headerName: 'Credit Terms', flex: 1 },
        { 
            field: 'outstandingBalance', 
            headerName: 'Outstanding Debt (Rs.)', 
            flex: 1, 
            type: 'number',
            valueFormatter: (value) => value ? Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"
        },
        {
            field: 'action',
            headerName: 'Accounting',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <Button 
                    variant="contained" 
                    color="success" 
                    size="small" 
                    disabled={params.row.outstandingBalance <= 0}
                    onClick={() => handleOpenPayment(params.row as Supplier)}
                >
                    Settle Payment
                </Button>
            )
        }
    ];

    return (
        <Box sx={{ padding: 3, height: 650, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#451a03' }}>Supplier Ledger</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>
                    Add Supplier
                </Button>
            </Box>

            {/* Upgraded DataGrid Table */}
            <DataGrid 
                rows={suppliers} 
                columns={columns} 
                slots={{ toolbar: GridToolbar }} 
                initialState={{ sorting: { sortModel: [{ field: 'outstandingBalance', sort: 'desc' }] } }}
            />

            {/* 1. Add Supplier Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Register New Supplier</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Supplier Name" name="supplierName" value={formData.supplierName} onChange={handleChange} required />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField fullWidth label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField fullWidth label="Territory" name="territory" value={formData.territory} onChange={handleChange} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Contact Details" name="contactDetails" value={formData.contactDetails} onChange={handleChange} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Credit Terms" name="creditTerms" value={formData.creditTerms} onChange={handleChange} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAddDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleAddSubmit} variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Supplier'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 2. Payment Settlement Dialog (The new feature) */}
            <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Settle Supplier Debt</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2, mt: 1 }}>
                        Record a payment to <strong>{selectedSupplier?.supplierName}</strong>. 
                        Current debt: <strong>Rs. {selectedSupplier?.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>.
                    </DialogContentText>
                    <TextField fullWidth type="number" label="Payment Amount (Rs.)" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Reference (e.g., Cheque No / Bank Transfer ID)" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
                    <Button onClick={handleProcessPayment} variant="contained" color="success">Process Payment</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SupplierManagement;