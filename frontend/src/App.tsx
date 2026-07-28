import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { TOKEN_KEY } from "./services/authService";

// --- Layouts ---
import AdminLayout from "./layouts/AdminLayout";
import RoomLayout from "./layouts/RoomLayout";
import MilkShopLayout from "./layouts/MilkShopLayout";
import BeerGardenLayout from "./layouts/BeerGardenLayout";
import AuditorLayout from "./layouts/AuditorLayout";

// --- Pages ---
import Login from "./features/auth/Login";
import AdminDashboard from "./features/admin/AdminDashboard";
import UtilityBillDashboard from "./features/admin/UtilityBillDashboard";
import UserManagementDashboard from "./features/admin/UserManagementDashboard";
import SystemAuditLogs from "./features/admin/SystemAuditLogs";

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

import AuditObservations from "./features/auditor/AuditObservations";
import AuditorDashboard from "./features/auditor/AuditorDashboard";

import BeerGardenDashboard from "./features/beer-garden/BeerGardenDashboard";
import PriceMatrix from "./features/beer-garden/PriceMatrix";
import LiquorIssuance from "./features/beer-garden/LiquorIssuance";
import Commissions from "./features/beer-garden/Commissions";
import GoodsReceivedNote from "./features/beer-garden/GoodsReceivedNote";
import SupplierManagement from "./features/beer-garden/SupplierManagement";
import Receivables from "./features/beer-garden/ReceivablesDashboard";
import ReportsDashboard from "./features/beer-garden/ReportsDashboard";
import PurchaseHistory from "./features/beer-garden/PurchaseHistory";

// --- Role-Based Protected Route (uses AuthContext) ---
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useAuth();
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role ?? localStorage.getItem('user_role');
  if (role && !allowedRoles.includes(role)) {
    console.warn(`Security Event: Role ${role} attempted unauthorized access.`);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const RootBoundary = () => {
  const { user } = useAuth();
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) return <Navigate to="/login" replace />;

  const role = user?.role ?? localStorage.getItem('user_role');

  switch (role) {
    case 'ROLE_ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'ROLE_MILK_SHOP':
      return <Navigate to="/milk-shop/dashboard" replace />;
    case 'ROLE_BEER_GARDEN':
      return <Navigate to="/beer-garden/dashboard" replace />;
    case 'ROLE_ROOM_BOOKING':
      return <Navigate to="/rooms/dashboard" replace />;
    case 'ROLE_AUDITOR':
      return <Navigate to="/auditor/dashboard" replace />;
    default:
      localStorage.clear();
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="utilities" element={<UtilityBillDashboard />} />
            <Route path="users" element={<UserManagementDashboard />} />
            <Route path="logs" element={<SystemAuditLogs />} />
            <Route path="observations" element={<AuditObservations />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_ROOM_BOOKING']} />}>
          <Route path="/rooms" element={<RoomLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RoomDashboardPage />} />
            <Route path="management" element={<RoomPage />} />
            <Route path="bookings" element={<BookingPage />} />
            <Route path="occupancy" element={<OccupancyMatrixPage />} />
            <Route path="remittance" element={<RemittancePage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MILK_SHOP']} />}>
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
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_BEER_GARDEN']} />}>
          <Route path="/beer-garden" element={<BeerGardenLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<BeerGardenDashboard />} />
            <Route path="suppliers" element={<SupplierManagement />} />
            <Route path="grn" element={<GoodsReceivedNote />} />
            <Route path="issuance" element={<LiquorIssuance />} />
            <Route path="prices" element={<PriceMatrix />} />
            <Route path="commissions" element={<Commissions />} />
            <Route path="receivables" element={<Receivables />} />
            <Route path="reports" element={<ReportsDashboard />} />
            <Route path="purchase-history" element={<PurchaseHistory />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ROLE_AUDITOR']} />}>
          <Route path="/auditor" element={<AuditorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AuditorDashboard />} />
            <Route path="observations" element={<AuditObservations />} />

            {/* Admin sub-routes */}
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/utilities" element={<UtilityBillDashboard />} />
            <Route path="admin/users" element={<UserManagementDashboard />} />
            <Route path="admin/logs" element={<SystemAuditLogs />} />

            {/* Milk Shop sub-routes */}
            <Route path="milk-shop/dashboard" element={<MilkShopDashboard />} />
            <Route path="milk-shop/suppliers" element={<SupplierPage />} />
            <Route path="milk-shop/items" element={<ItemPage />} />
            <Route path="milk-shop/grn" element={<GrnPage />} />
            <Route path="milk-shop/stock" element={<StockLedgerPage />} />
            <Route path="milk-shop/stock-adjustments" element={<StockAdjustmentPage />} />
            <Route path="milk-shop/daily-sales" element={<DailySalesPage />} />

            {/* Room Section sub-routes */}
            <Route path="rooms/dashboard" element={<RoomDashboardPage />} />
            <Route path="rooms/list" element={<RoomPage />} />
            <Route path="rooms/bookings" element={<BookingPage />} />
            <Route path="rooms/occupancy" element={<OccupancyMatrixPage />} />
            <Route path="rooms/remittance" element={<RemittancePage />} />

            {/* Beer Garden sub-routes */}
            <Route path="beer-garden/dashboard" element={<BeerGardenDashboard />} />
            <Route path="beer-garden/suppliers" element={<SupplierManagement />} />
            <Route path="beer-garden/grn" element={<GoodsReceivedNote />} />
            <Route path="beer-garden/issuance" element={<LiquorIssuance />} />
            <Route path="beer-garden/prices" element={<PriceMatrix />} />
            <Route path="beer-garden/commissions" element={<Commissions />} />
            <Route path="beer-garden/receivables" element={<Receivables />} />
            <Route path="beer-garden/purchase-history" element={<PurchaseHistory />} />
            <Route path="beer-garden/reports" element={<ReportsDashboard />} />
          </Route>
        </Route>

        <Route path="/" element={<RootBoundary />} />
        <Route path="*" element={<RootBoundary />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;