import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RoomPage from "./features/room-section/RoomPage";
import BookingPage from "./features/room-section/BookingPage";
import OccupancyMatrixPage from "./features/room-section/OccupancyMatrixPage";
import RemittancePage from "./features/room-section/RemittancePage";
import RoomDashboardPage from "./features/room-section/RoomDashboardPage";
import BeerGardenDashboard from "./features/beer-garden/BeerGardenDashboard";
import Login from "./features/auth/Login";

// The Guard: If no token exists, the user is redirected to /login
const ProtectedRoute = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Route: Anyone can access the Login page */}
        <Route path="/login" element={<Login />} />

        {/* 2. Protected Routes: Only accessible if logged in (has JWT token) */}
        <Route element={<ProtectedRoute />}>
          
          {/* Room Section (Uses the MainLayout sidebar) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/rooms/dashboard" replace />} />
            <Route path="rooms/dashboard" element={<RoomDashboardPage />} />
            <Route path="rooms" element={<RoomPage />} />
            <Route path="rooms/bookings" element={<BookingPage />} />
            <Route path="rooms/occupancy" element={<OccupancyMatrixPage />} />
            <Route path="rooms/remittance" element={<RemittancePage />} />
          </Route>

          {/* Beer Garden Section */}
          <Route path="/beer-garden/dashboard" element={<BeerGardenDashboard />} />
          
        </Route>

        {/* Catch-all route to redirect unknown paths back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;