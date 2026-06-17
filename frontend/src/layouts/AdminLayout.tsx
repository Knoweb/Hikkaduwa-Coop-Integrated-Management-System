import { Box, Divider, Drawer, List, ListItemButton, Typography } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ONLY ADMIN MENUS
  const menuItems = [
    { label: "Global Dashboard", path: "/admin/dashboard" },
    { label: "User Management", path: "/admin/users" },
    { label: "System Audit Logs", path: "/admin/logs" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#0f172a", // Navy Blue Branding
            color: "white",
            borderRight: "none",
          },
        }}
      >
        <Box sx={{ px: 2, py: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Coop System</Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>System Administration</Typography>
        </Box>
        <Divider sx={{ borderColor: "#334155" }} />
        <List sx={{ px: 1, mt: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2, mb: 0.5, color: "white",
                "&.Mui-selected": { backgroundColor: "#FF5A00", color: "white" },
                "&.Mui-selected:hover": { backgroundColor: "#ea580c" },
                "&:hover": { backgroundColor: "#1e293b" },
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

export default AdminLayout;