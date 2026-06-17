import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { API_BASE_URLS } from "../../api/apiConfig";

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

type MoneyValue = number | string | undefined;

type Room = {
  id: string;
  roomNumber: string;
  roomType: string;
  basePrice: number;
  status: string;
};

type Booking = {
  id: string;
  guestName: string;
  nicPassport: string;
  checkIn: string;
  checkOut: string;
  advancePayment: number;
  subTotal: number;
  taxAmount: number;
  totalDue: number;
  status: string;
  room: Room;
};

type Remittance = {
  id: string;
  remittanceId?: string;
  remittanceDate: string;
  totalCollected: MoneyValue;
  expectedInvoiceTotal: MoneyValue;
  discrepancy: MoneyValue;
  receptionistId: string;
  message: string;
};

const formatMoney = (value: MoneyValue) => {
  return Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date
    .toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "");
};

function RoomDashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [remittances, setRemittances] = useState<Remittance[]>([]);
  const [error, setError] = useState("");

  const todayKey = formatDateKey(new Date());

  const loadDashboardData = async () => {
    try {
      const roomsResponse = await fetch(API_BASE_URLS.roomSection);

      if (!roomsResponse.ok) {
        throw new Error("Failed to load rooms");
      }

      const roomsData: Room[] = await roomsResponse.json();

      const bookingsResponse = await fetch(
        `${API_BASE_URLS.roomSection}/bookings`
      );

      if (!bookingsResponse.ok) {
        throw new Error("Failed to load bookings");
      }

      const bookingsData: Booking[] = await bookingsResponse.json();

      const remittanceResponse = await fetch(
        `${API_BASE_URLS.roomSection}/remittances`
      );

      if (!remittanceResponse.ok) {
        throw new Error("Failed to load remittances");
      }

      const remittanceData: Remittance[] = await remittanceResponse.json();

      setRooms(roomsData);
      setBookings(bookingsData);
      setRemittances(remittanceData);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Check room-section-service.");
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "AVAILABLE"
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "OCCUPIED"
  ).length;

  const maintenanceRooms = rooms.filter(
    (room) => room.status === "MAINTENANCE"
  ).length;

  const activeBookings = bookings.filter(
    (booking) => booking.status === "ACTIVE"
  ).length;

  const checkedOutBookings = bookings.filter(
    (booking) => booking.status === "CHECKED_OUT"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "CANCELLED"
  ).length;

  const todayBookings = bookings.filter((booking) => {
    return formatDateKey(new Date(booking.checkIn)) === todayKey;
  });

  const todayExpectedIncome = todayBookings.reduce((total, booking) => {
    return total + Number(booking.totalDue || 0);
  }, 0);

  const todayRemittance = remittances.find(
    (item) => item.remittanceDate === todayKey
  );

  const recentBookings = [...bookings]
    .sort((a, b) => {
      return new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime();
    })
    .slice(0, 5);

  const getBookingStatusColor = (status: string): ChipColor => {
    if (status === "ACTIVE") return "success";
    if (status === "CHECKED_OUT") return "primary";
    if (status === "CANCELLED") return "default";
    return "warning";
  };

  const getRemittanceStatusColor = (discrepancy: MoneyValue): ChipColor => {
    const value = Number(discrepancy || 0);

    if (value === 0) return "success";
    if (value < 0) return "error";
    return "warning";
  };

  const getRemittanceStatusLabel = (discrepancy: MoneyValue) => {
    const value = Number(discrepancy || 0);

    if (value === 0) return "Balanced";
    if (value < 0) return "Short";
    return "Extra";
  };

  const summaryCards = [
    {
      title: "Total Rooms",
      value: totalRooms,
      helper: "All rooms in the system",
    },
    {
      title: "Available Rooms",
      value: availableRooms,
      helper: "Ready for booking",
    },
    {
      title: "Occupied Rooms",
      value: occupiedRooms,
      helper: "Currently occupied",
    },
    {
      title: "Maintenance Rooms",
      value: maintenanceRooms,
      helper: "Not available for booking",
    },
    {
      title: "Active Bookings",
      value: activeBookings,
      helper: "Current active guest bookings",
    },
    {
      title: "Today Bookings",
      value: todayBookings.length,
      helper: "Bookings starting today",
    },
    {
      title: "Checked-out Bookings",
      value: checkedOutBookings,
      helper: "Completed bookings",
    },
    {
      title: "Cancelled Bookings",
      value: cancelledBookings,
      helper: "Cancelled records",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Room Section Dashboard
      </Typography>

      <Typography color="text.secondary">
        Quick overview of rooms, bookings, occupancy, and daily collection.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mt: 3,
        }}
      >
        {summaryCards.map((card) => (
          <Card key={card.title} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {card.title}
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {card.value}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {card.helper}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
          mt: 3,
        }}
      >
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Today Expected Income
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Rs. {formatMoney(todayExpectedIncome)}
            </Typography>

            <Typography color="text.secondary">
              Based on bookings starting today.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Today Remittance Status
            </Typography>

            {todayRemittance ? (
              <>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Rs. {formatMoney(todayRemittance.totalCollected)}
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  Difference: Rs. {formatMoney(todayRemittance.discrepancy)}
                </Typography>

                <Chip
                  label={getRemittanceStatusLabel(todayRemittance.discrepancy)}
                  color={getRemittanceStatusColor(todayRemittance.discrepancy)}
                  size="small"
                />
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Not Recorded
                </Typography>

                <Typography color="text.secondary">
                  No remittance entered for today.
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Recent Bookings
        </Typography>

        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>Guest</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Total Due</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.room?.roomNumber}</TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>{formatDateTime(booking.checkIn)}</TableCell>
                  <TableCell>{formatDateTime(booking.checkOut)}</TableCell>
                  <TableCell>Rs. {formatMoney(booking.totalDue)}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={getBookingStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}

              {recentBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No recent bookings found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RoomDashboardPage;