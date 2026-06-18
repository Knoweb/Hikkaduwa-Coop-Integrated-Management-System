import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";

// --- Layouts ---
import AdminLayout from "./layouts/AdminLayout";
import RoomLayout from "./layouts/RoomLayout";
import MilkShopLayout from "./layouts/MilkShopLayout";
import BeerGardenLayout from "./layouts/BeerGardenLayout";

// --- Pages ---
import Login from "./features/auth/Login";
import AdminDashboard from "./features/admin/AdminDashboard";

import RoomDashboardPage from "./features/room-section/RoomDashboardPage";
import RoomPage from "./features/room-section/RoomPage";
import BookingPage from "./features/room-section/BookingPage";
import OccupancyMatrixPage from "./features/room-section/OccupancyMatrixPage";
import RemittancePage from "./features/room-section/RemittancePage";

import MilkShopDashboard from "./features/milk-shop/MilkShopDashboard";
import SupplierPage from "./features/milk-shop/SupplierPage";
import ItemPage from "./features/milk-shop/ItemPage";
import GrnPage from "./features/milk-shop/GrnPage";
import StockLedgerPage from "./features/milk-shop/StockLedgerPage";
import DailySalesPage from "./features/milk-shop/DailySalesPage";
import StockAdjustmentPage from "./features/milk-shop/stock-adjustments/StockAdjustmentPage";

import BeerGardenDashboard from "./features/beer-garden/BeerGardenDashboard";
import PriceMatrix from "./features/beer-garden/PriceMatrix";
import LiquorIssuance from "./features/beer-garden/BeerIssuance";
import Commissions from "./features/beer-garden/Commissions";
import GoodsReceivedNote from "./features/beer-garden/GoodsReceivedNote";
import SupplierManagement from "./features/beer-garden/SupplierManagement";

const ProtectedRoute = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- NEW: Smart Traffic Controller ---
const RootBoundary = () => {
  const token = localStorage.getItem('jwt_token');
  
  // 1. If no token, kick them to login page immediately
  if (!token) return <Navigate to="/login" replace />;

  // 2. If token exists, check their role and send them to their specific dashboard
  const role = localStorage.getItem('user_role');
  switch (role) {
    case 'milk-shop': return <Navigate to="/milk-shop/dashboard" replace />;
    case 'beer-garden': return <Navigate to="/beer-garden/dashboard" replace />;
    case 'room-section': return <Navigate to="/rooms/dashboard" replace />;
    case 'dashboard': return <Navigate to="/admin/dashboard" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          
          {/* 1. ADMIN DOMAIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminDashboard />} /> 
            <Route path="logs" element={<AdminDashboard />} />
          </Route>

          {/* 2. ROOM SECTION DOMAIN */}
          <Route path="/rooms" element={<RoomLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RoomDashboardPage />} />
            <Route path="management" element={<RoomPage />} />
            <Route path="bookings" element={<BookingPage />} />
            <Route path="occupancy" element={<OccupancyMatrixPage />} />
            <Route path="remittance" element={<RemittancePage />} />
          </Route>

          {/* 3. MILK SHOP DOMAIN */}
          <Route path="/milk-shop" element={<MilkShopLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MilkShopDashboard />} />
            <Route path="suppliers" element={<SupplierPage />} />
            <Route path="items" element={<ItemPage />} />
            <Route path="stock" element={<StockLedgerPage />} />
            <Route path="grn" element={<GrnPage />} />
            <Route path="daily-sales" element={<DailySalesPage />} />
            <Route path="stock-adjustments" element={<StockAdjustmentPage />} />
          </Route>

          {/* 4. BEER GARDEN DOMAIN */}
          <Route path="/beer-garden" element={<BeerGardenLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<BeerGardenDashboard />} />
            <Route path="suppliers" element={<SupplierManagement />} />
            <Route path="grn" element={<GoodsReceivedNote />} />
            <Route path="issuance" element={<LiquorIssuance />} />
            <Route path="prices" element={<PriceMatrix />} />
            <Route path="commissions" element={<Commissions />} />
          </Route>

        </Route>

        {/* --- NEW: Attach the Traffic Controller to the root and catch-all routes --- */}
        <Route path="/" element={<RootBoundary />} />
        <Route path="*" element={<RootBoundary />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;