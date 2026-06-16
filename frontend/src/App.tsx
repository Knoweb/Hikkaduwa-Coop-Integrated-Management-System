import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import RoomPage from "./features/room-section/RoomPage";
import BookingPage from "./features/room-section/BookingPage";
import OccupancyMatrixPage from "./features/room-section/OccupancyMatrixPage";
import RemittancePage from "./features/room-section/RemittancePage";
import MilkShopDashboard from "./features/milk-shop/MilkShopDashboard";
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
        {/* PUBLIC ROUTE - Login page is accessible to everyone */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES - Only accessible if user has a valid JWT */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            
            {/* Milk Shop Section */}
            <Route path="milk-shop" element={<MilkShopDashboard />} />
            
            {/* Beer Garden Section */}
            <Route path="beer-garden" element={<BeerGardenDashboard />} />
            
            {/* Room & Booking Section */}
            <Route path="rooms" element={<RoomPage />} />
            <Route path="rooms/bookings" element={<BookingPage />} />
            <Route path="rooms/occupancy" element={<OccupancyMatrixPage />} />
            <Route path="rooms/remittance" element={<RemittancePage />} />
          </Route>
        </Route>

        {/* Catch-all route to redirect unknown paths to home/login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;