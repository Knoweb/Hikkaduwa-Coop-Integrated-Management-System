import React, { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Collapse, Button } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import HotelIcon from '@mui/icons-material/Hotel';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 260;

const AuditorLayout: React.FC = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [openAdmin, setOpenAdmin] = useState(false);
    const [openMilk, setOpenMilk] = useState(false);
    const [openRooms, setOpenRooms] = useState(false);
    const [openBeer, setOpenBeer] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    const navItemStyle = (path: string) => ({
        borderRadius: 2, mb: 0.5, color: "white", mx: 1,
        "&.Mui-selected": { backgroundColor: "#f97316", color: "white" },
        "&.Mui-selected:hover": { backgroundColor: "#ea580c" },
        "&:hover": { backgroundColor: "#991b1b" },
    });

    const navSubItemStyle = (path: string) => ({
        borderRadius: 2, mb: 0.5, color: "white", mx: 1, pl: 4,
        "&.Mui-selected": { backgroundColor: "#f97316", color: "white" },
        "&.Mui-selected:hover": { backgroundColor: "#ea580c" },
        "&:hover": { backgroundColor: "#991b1b" },
    });

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff7ed' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#7f1d1d",
                        color: "white",
                        borderRight: "none",
                    },
                }}
            >
                <Box sx={{ px: 2, py: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Coop System</Typography>
                    <Typography variant="body2" sx={{ color: "#fed7aa", mt: 0.5 }}>Auditor Portal</Typography>
                </Box>
                <Divider sx={{ borderColor: "#b91c1c" }} />

                <List sx={{ px: 0, mt: 1, flexGrow: 1, overflowY: 'auto' }}>
                    {/* Top Level */}
                    <ListItemButton selected={isActive('/auditor/dashboard')} onClick={() => navigate('/auditor/dashboard')} sx={navItemStyle('/auditor/dashboard')}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Auditor Dashboard" />
                    </ListItemButton>
                    <ListItemButton selected={isActive('/auditor/observations')} onClick={() => navigate('/auditor/observations')} sx={navItemStyle('/auditor/observations')}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><AssessmentIcon /></ListItemIcon>
                        <ListItemText primary="Audit Observations" />
                    </ListItemButton>

                    <Divider sx={{ borderColor: "#b91c1c", my: 1 }} />

                    {/* Admin Records */}
                    <ListItemButton onClick={() => setOpenAdmin(!openAdmin)} sx={{ borderRadius: 2, mb: 0.5, color: "white", mx: 1, '&:hover': { backgroundColor: "#991b1b" } }}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><AdminPanelSettingsIcon /></ListItemIcon>
                        <ListItemText primary="Admin Records" />
                        {openAdmin ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openAdmin} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton selected={isActive('/auditor/admin/dashboard')} onClick={() => navigate('/auditor/admin/dashboard')} sx={navSubItemStyle('/auditor/admin/dashboard')}>
                                <ListItemText primary="Global Dashboard" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/admin/utilities')} onClick={() => navigate('/auditor/admin/utilities')} sx={navSubItemStyle('/auditor/admin/utilities')}>
                                <ListItemText primary="Utility Allocations" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/admin/users')} onClick={() => navigate('/auditor/admin/users')} sx={navSubItemStyle('/auditor/admin/users')}>
                                <ListItemText primary="Users" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/admin/logs')} onClick={() => navigate('/auditor/admin/logs')} sx={navSubItemStyle('/auditor/admin/logs')}>
                                <ListItemText primary="Audit Logs" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Milk Shop */}
                    <ListItemButton onClick={() => setOpenMilk(!openMilk)} sx={{ borderRadius: 2, mb: 0.5, color: "white", mx: 1, '&:hover': { backgroundColor: "#991b1b" } }}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><LocalDrinkIcon /></ListItemIcon>
                        <ListItemText primary="Milk Shop" />
                        {openMilk ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openMilk} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton selected={isActive('/auditor/milk-shop/dashboard')} onClick={() => navigate('/auditor/milk-shop/dashboard')} sx={navSubItemStyle('/auditor/milk-shop/dashboard')}>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/milk-shop/suppliers')} onClick={() => navigate('/auditor/milk-shop/suppliers')} sx={navSubItemStyle('/auditor/milk-shop/suppliers')}>
                                <ListItemText primary="Suppliers" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/milk-shop/items')} onClick={() => navigate('/auditor/milk-shop/items')} sx={navSubItemStyle('/auditor/milk-shop/items')}>
                                <ListItemText primary="Items / Products" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/milk-shop/grn')} onClick={() => navigate('/auditor/milk-shop/grn')} sx={navSubItemStyle('/auditor/milk-shop/grn')}>
                                <ListItemText primary="Purchase Invoices" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/milk-shop/stock')} onClick={() => navigate('/auditor/milk-shop/stock')} sx={navSubItemStyle('/auditor/milk-shop/stock')}>
                                <ListItemText primary="Stock Ledger" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/milk-shop/stock-adjustments')} onClick={() => navigate('/auditor/milk-shop/stock-adjustments')} sx={navSubItemStyle('/auditor/milk-shop/stock-adjustments')}>
                                <ListItemText primary="Stock Adjustments" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/milk-shop/daily-sales')} onClick={() => navigate('/auditor/milk-shop/daily-sales')} sx={navSubItemStyle('/auditor/milk-shop/daily-sales')}>
                                <ListItemText primary="Daily Sales" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Room Section */}
                    <ListItemButton onClick={() => setOpenRooms(!openRooms)} sx={{ borderRadius: 2, mb: 0.5, color: "white", mx: 1, '&:hover': { backgroundColor: "#991b1b" } }}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><HotelIcon /></ListItemIcon>
                        <ListItemText primary="Room Section" />
                        {openRooms ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openRooms} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton selected={isActive('/auditor/rooms/dashboard')} onClick={() => navigate('/auditor/rooms/dashboard')} sx={navSubItemStyle('/auditor/rooms/dashboard')}>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/rooms/list')} onClick={() => navigate('/auditor/rooms/list')} sx={navSubItemStyle('/auditor/rooms/list')}>
                                <ListItemText primary="Rooms" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/rooms/bookings')} onClick={() => navigate('/auditor/rooms/bookings')} sx={navSubItemStyle('/auditor/rooms/bookings')}>
                                <ListItemText primary="Bookings" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/rooms/occupancy')} onClick={() => navigate('/auditor/rooms/occupancy')} sx={navSubItemStyle('/auditor/rooms/occupancy')}>
                                <ListItemText primary="Occupancy Matrix" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/rooms/remittance')} onClick={() => navigate('/auditor/rooms/remittance')} sx={navSubItemStyle('/auditor/rooms/remittance')}>
                                <ListItemText primary="Remittance History" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Beer Garden */}
                    <ListItemButton onClick={() => setOpenBeer(!openBeer)} sx={{ borderRadius: 2, mb: 0.5, color: "white", mx: 1, '&:hover': { backgroundColor: "#991b1b" } }}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><SportsBarIcon /></ListItemIcon>
                        <ListItemText primary="Beer Garden" />
                        {openBeer ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openBeer} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton selected={isActive('/auditor/beer-garden/dashboard')} onClick={() => navigate('/auditor/beer-garden/dashboard')} sx={navSubItemStyle('/auditor/beer-garden/dashboard')}>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/beer-garden/suppliers')} onClick={() => navigate('/auditor/beer-garden/suppliers')} sx={navSubItemStyle('/auditor/beer-garden/suppliers')}>
                                <ListItemText primary="Suppliers" />
                            </ListItemButton>


                            <ListItemButton selected={isActive('/auditor/beer-garden/prices')} onClick={() => navigate('/auditor/beer-garden/prices')} sx={navSubItemStyle('/auditor/beer-garden/prices')}>
                                <ListItemText primary="Price Matrix" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/beer-garden/commissions')} onClick={() => navigate('/auditor/beer-garden/commissions')} sx={navSubItemStyle('/auditor/beer-garden/commissions')}>
                                <ListItemText primary="Commissions" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/beer-garden/receivables')} onClick={() => navigate('/auditor/beer-garden/receivables')} sx={navSubItemStyle('/auditor/beer-garden/receivables')}>
                                <ListItemText primary="Receivables" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/beer-garden/purchase-history')} onClick={() => navigate('/auditor/beer-garden/purchase-history')} sx={navSubItemStyle('/auditor/beer-garden/purchase-history')}>
                                <ListItemText primary="Purchase History" />
                            </ListItemButton>
                            <ListItemButton selected={isActive('/auditor/beer-garden/reports')} onClick={() => navigate('/auditor/beer-garden/reports')} sx={navSubItemStyle('/auditor/beer-garden/reports')}>
                                <ListItemText primary="Reports" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>

                <Box sx={{ p: 2 }}>
                    <Divider sx={{ borderColor: "#b91c1c", mb: 2 }} />
                    <Typography variant="caption" sx={{ color: "#fed7aa", display: "block", mb: 1 }}>
                        Read-only Auditor Access
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        color="inherit"
                        fullWidth
                        onClick={handleLogout}
                        sx={{ borderColor: '#b91c1c', '&:hover': { backgroundColor: '#b91c1c' } }}
                    >
                        Sign Out
                    </Button>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* Header Badge */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Box sx={{ backgroundColor: '#f97316', color: 'white', px: 2, py: 0.5, borderRadius: 1, display: 'inline-flex', alignItems: 'center', fontWeight: 'bold', fontSize: 14, boxShadow: 1 }}>
                        Read-only Auditor Access
                    </Box>
                </Box>
                <Outlet />
            </Box>
        </Box>
    );
};

export default AuditorLayout;
