import { Box, Divider, Drawer, List, ListItemButton, Typography } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

function BeerGardenLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // BEER GARDEN MENUS
  const menuItems = [
    { label: "Logistics Dashboard", path: "/beer-garden/dashboard" },
    { label: "Liquor Issuance", path: "/beer-garden/issuance" },
    { label: "Price Matrix", path: "/beer-garden/prices" },
    { label: "Commissions", path: "/beer-garden/commissions" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#fffbeb" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#451a03", // Dark Amber/Brown Branding
            color: "white",
            borderRight: "none",
          },
        }}
      >
        <Box sx={{ px: 2, py: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Coop System</Typography>
          <Typography variant="body2" sx={{ color: "#fcd34d", mt: 0.5 }}>Beer Garden</Typography>
        </Box>
        <Divider sx={{ borderColor: "#78350f" }} />
        <List sx={{ px: 1, mt: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2, mb: 0.5, color: "white",
                "&.Mui-selected": { backgroundColor: "#f59e0b", color: "white" },
                "&.Mui-selected:hover": { backgroundColor: "#d97706" },
                "&:hover": { backgroundColor: "#78350f" },
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

export default BeerGardenLayout;