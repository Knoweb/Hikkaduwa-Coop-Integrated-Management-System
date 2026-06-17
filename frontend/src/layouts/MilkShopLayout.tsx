import { Box, Divider, Drawer, List, ListItemButton, Typography } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

function MilkShopLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // MILK SHOP MENUS
  const menuItems = [
    { label: "Operations Dashboard", path: "/milk-shop/dashboard" },
    { label: "Daily Sales", path: "/milk-shop/sales" },
    { label: "Stock Ledger", path: "/milk-shop/inventory" },
    { label: "Suppliers & GRN", path: "/milk-shop/suppliers" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f0fdf4" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#064e3b", // Forest Green Branding
            color: "white",
            borderRight: "none",
          },
        }}
      >
        <Box sx={{ px: 2, py: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Coop System</Typography>
          <Typography variant="body2" sx={{ color: "#a7f3d0", mt: 0.5 }}>Milk Shop Division</Typography>
        </Box>
        <Divider sx={{ borderColor: "#047857" }} />
        <List sx={{ px: 1, mt: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2, mb: 0.5, color: "white",
                "&.Mui-selected": { backgroundColor: "#10b981", color: "white" },
                "&.Mui-selected:hover": { backgroundColor: "#059669" },
                "&:hover": { backgroundColor: "#065f46" },
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: isActive(item.path) ? "bold" : "normal" }}>
                {item.label}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default MilkShopLayout;