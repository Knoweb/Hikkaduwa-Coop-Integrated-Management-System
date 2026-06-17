import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import RoomPage from "./features/room-section/RoomPage";
import BookingPage from "./features/room-section/BookingPage";
import OccupancyMatrixPage from "./features/room-section/OccupancyMatrixPage";
import RemittancePage from "./features/room-section/RemittancePage";
import RoomDashboardPage from "./features/room-section/RoomDashboardPage";
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
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="rooms/dashboard" element={<RoomDashboardPage />} />
          <Route path="rooms" element={<RoomPage />} />
          <Route path="rooms/bookings" element={<BookingPage />} />
          <Route path="rooms/occupancy" element={<OccupancyMatrixPage />} />
          <Route path="rooms/remittance" element={<RemittancePage />} />
          <Route path="milk-shop" element={<MilkShopDashboard />} />
        </Route>

        {/* Catch-all route to redirect unknown paths to home/login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;