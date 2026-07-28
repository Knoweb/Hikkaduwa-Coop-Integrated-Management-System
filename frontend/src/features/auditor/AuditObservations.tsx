import { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, TextField, MenuItem, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import api from '../../api/axiosConfig';

const AuditObservations = () => {
    const role = localStorage.getItem('user_role');
    const isAuditor = role === 'ROLE_AUDITOR';
    const isAdmin = role === 'ROLE_ADMIN';

    const [observations, setObservations] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [responseDialog, setResponseDialog] = useState(false);
    const [selectedObs, setSelectedObs] = useState<any>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [moduleName, setModuleName] = useState('Global');
    const [comment, setComment] = useState('');
    const [obsType, setObsType] = useState('OBSERVATION');
    const [severity, setSeverity] = useState('LOW');
    
    // Admin response state
    const [adminResponse, setAdminResponse] = useState('');
    const [newStatus, setNewStatus] = useState('RESPONDED');

    const fetchObservations = async () => {
        try {
            const res = await api.get('/api/v1/audit-observations');
            setObservations(res.data);
        } catch (err) {
            console.error("Failed to load observations");
        }
    };

    useEffect(() => {
        fetchObservations();
    }, []);

    const handleSaveObservation = async () => {
        try {
            const payload = {
                title, module: moduleName, comment, observationType: obsType, severity
            };
            if (selectedObs) {
                await api.patch(`/api/v1/audit-observations/${selectedObs.id}`, payload);
            } else {
                await api.post('/api/v1/audit-observations', payload);
            }
            setOpenDialog(false);
            fetchObservations();
        } catch (err) {
            alert("Failed to save observation");
        }
    };

    const handleAdminRespond = async () => {
        try {
            if (adminResponse) {
                await api.post(`/api/v1/audit-observations/${selectedObs.id}/response`, adminResponse, {
                    headers: { 'Content-Type': 'text/plain' }
                });
            }
            if (newStatus !== selectedObs.status) {
                await api.patch(`/api/v1/audit-observations/${selectedObs.id}/status`, newStatus, {
                    headers: { 'Content-Type': 'text/plain' }
                });
            }
            setResponseDialog(false);
            fetchObservations();
        } catch (err) {
            alert("Failed to submit response");
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Audit Observations</Typography>
                {isAuditor && (
                    <Button variant="contained" color="primary" onClick={() => {
                        setSelectedObs(null); setTitle(''); setComment('');
                        setOpenDialog(true);
                    }}>
                        Add Observation
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Module</TableCell>
                            <TableCell>Type & Severity</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {observations.map(obs => (
                            <TableRow key={obs.id}>
                                <TableCell>
                                    <Typography variant="subtitle2">{obs.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">{obs.comment.substring(0, 50)}...</Typography>
                                    {obs.adminResponse && (
                                        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                            <strong>Admin Response:</strong> {obs.adminResponse.substring(0, 50)}...
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>{obs.module}</TableCell>
                                <TableCell>
                                    <Chip label={obs.observationType} size="small" sx={{ mr: 1 }} />
                                    <Chip label={obs.severity} color={obs.severity === 'HIGH' ? 'error' : 'default'} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Chip label={obs.status} color={obs.status === 'OPEN' ? 'warning' : 'success'} size="small" />
                                </TableCell>
                                <TableCell>
                                    {isAuditor && obs.status === 'OPEN' && ( // Assuming username matches auditorId on backend
                                        <IconButton onClick={() => {
                                            setSelectedObs(obs);
                                            setTitle(obs.title); setModuleName(obs.module);
                                            setComment(obs.comment); setObsType(obs.observationType);
                                            setSeverity(obs.severity);
                                            setOpenDialog(true);
                                        }}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {isAdmin && (
                                        <IconButton onClick={() => {
                                            setSelectedObs(obs);
                                            setAdminResponse(obs.adminResponse || '');
                                            setNewStatus(obs.status);
                                            setResponseDialog(true);
                                        }}>
                                            <ReplyIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Auditor Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedObs ? 'Edit Observation' : 'New Observation'}</DialogTitle>
                <DialogContent dividers>
                    <TextField fullWidth label="Title" value={title} onChange={e => setTitle(e.target.value)} sx={{ mb: 2 }} />
                    <TextField select fullWidth label="Module" value={moduleName} onChange={e => setModuleName(e.target.value)} sx={{ mb: 2 }}>
                        <MenuItem value="Global">Global</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Milk Shop">Milk Shop</MenuItem>
                        <MenuItem value="Room Section">Room Section</MenuItem>
                        <MenuItem value="Beer Garden">Beer Garden</MenuItem>
                    </TextField>
                    <TextField select fullWidth label="Observation Type" value={obsType} onChange={e => setObsType(e.target.value)} sx={{ mb: 2 }}>
                        <MenuItem value="QUESTION">Question</MenuItem>
                        <MenuItem value="OBSERVATION">Observation</MenuItem>
                        <MenuItem value="DOCUMENT_REQUEST">Document Request</MenuItem>
                        <MenuItem value="CONTROL_ISSUE">Control Issue</MenuItem>
                    </TextField>
                    <TextField select fullWidth label="Severity" value={severity} onChange={e => setSeverity(e.target.value)} sx={{ mb: 2 }}>
                        <MenuItem value="INFO">Info</MenuItem>
                        <MenuItem value="LOW">Low</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="HIGH">High</MenuItem>
                    </TextField>
                    <TextField fullWidth multiline rows={4} label="Comment / Details" value={comment} onChange={e => setComment(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveObservation} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Admin Response Dialog */}
            <Dialog open={responseDialog} onClose={() => setResponseDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Respond to Observation</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle1" gutterBottom><strong>Observation:</strong> {selectedObs?.comment}</Typography>
                    <TextField fullWidth multiline rows={3} label="Admin Response" value={adminResponse} onChange={e => setAdminResponse(e.target.value)} sx={{ mb: 2, mt: 2 }} />
                    <TextField select fullWidth label="Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                        <MenuItem value="OPEN">Open</MenuItem>
                        <MenuItem value="RESPONDED">Responded</MenuItem>
                        <MenuItem value="RESOLVED">Resolved</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResponseDialog(false)}>Cancel</Button>
                    <Button onClick={handleAdminRespond} variant="contained">Submit Response</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AuditObservations;
