import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import RoomPage from "./features/room-section/RoomPage";
import BookingPage from "./features/room-section/BookingPage";
import OccupancyMatrixPage from "./features/room-section/OccupancyMatrixPage";
import RemittancePage from "./features/room-section/RemittancePage";
import MilkShopDashboard from "./features/milk-shop/MilkShopDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="rooms" element={<RoomPage />} />
          <Route path="rooms/bookings" element={<BookingPage />} />
          <Route path="rooms/occupancy" element={<OccupancyMatrixPage />} />
          <Route path="rooms/remittance" element={<RemittancePage />} />
          <Route path="milk-shop" element={<MilkShopDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;