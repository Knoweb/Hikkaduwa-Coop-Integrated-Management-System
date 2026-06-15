import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 240;

function MainLayout() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Hikkaduwa Co-op Integrated Management System
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1f2937",
            color: "white",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6">Co-op System</Typography>
        </Toolbar>

        <List>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/rooms")}>
            <ListItemText primary="Room Section" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/milk-shop")}>
            <ListItemText primary="Milk Shop" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;