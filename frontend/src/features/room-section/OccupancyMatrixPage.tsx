import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { API_BASE_URLS } from "../../api/apiConfig";

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
  status: string;
  room: Room;
};

type DayCell = {
  date: Date;
  isCurrentMonth: boolean;
};

// --- ADDED FORMATTING HELPER HERE ---
const formatCustomDateTime = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(",", ""); // Removes the default comma between date and time
};

function OccupancyMatrixPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const roomsResponse = await fetch(API_BASE_URLS.roomSection);

      if (!roomsResponse.ok) {
        throw new Error("Failed to load rooms");
      }

      const roomsData = await roomsResponse.json();

      const bookingsResponse = await fetch(
        `${API_BASE_URLS.roomSection}/bookings`
      );

      if (!bookingsResponse.ok) {
        throw new Error("Failed to load bookings");
      }

      const bookingsData = await bookingsResponse.json();

      setRooms(roomsData);
      setBookings(bookingsData);
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Check room-section-service on port 8084.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return formatDateKey(date1) === formatDateKey(date2);
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const monthLabel = currentMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo<DayCell[]>(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDay = firstDayOfMonth.getDay();
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const days: DayCell[] = [];

    for (let i = startDay; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({
        date,
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
      });
    }

    while (days.length % 7 !== 0) {
      const nextDate = new Date(year, month, days.length - startDay + 1);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  const isBookingOnDate = (booking: Booking, date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const bookingStart = new Date(booking.checkIn);
    const bookingEnd = new Date(booking.checkOut);

    return bookingStart <= dayEnd && bookingEnd >= dayStart;
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      return (
        booking.status === "ACTIVE" &&
        booking.room &&
        isBookingOnDate(booking, date)
      );
    });
  };

  const getDaySummary = (date: Date) => {
    let available = 0;
    let booked = 0;
    let occupied = 0;
    let maintenance = 0;

    rooms.forEach((room) => {
      if (room.status === "MAINTENANCE") {
        maintenance++;
        return;
      }

      const hasBooking = bookings.some((booking) => {
        return (
          booking.status === "ACTIVE" &&
          booking.room?.id === room.id &&
          isBookingOnDate(booking, date)
        );
      });

      if (!hasBooking) {
        available++;
      } else if (isToday(date) || room.status === "OCCUPIED") {
        occupied++;
      } else {
        booked++;
      }
    });

    return {
      available,
      booked,
      occupied,
      maintenance,
    };
  };

  const selectedDateBookings = getBookingsForDate(selectedDate);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Room Occupancy Calendar
          </Typography>

          <Typography color="text.secondary">
            Monthly view of room bookings and availability.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" size="small" onClick={goToPreviousMonth}>
            Previous
          </Button>

          <Button variant="contained" size="small" onClick={goToToday}
          sx={{
                backgroundColor: "#f97316",
                color: "white",
                "&:hover": {
                backgroundColor: "#ea580c", 
                },
              }}>
            Today
          </Button>

          <Button variant="outlined" size="small" onClick={goToNextMonth}>
            Next
          </Button>
        </Box>
      </Box>

      {/* Top Summary */}
      <Paper sx={{ p: 1.5, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">{monthLabel}</Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip label="A - Available" color="success" size="small" />
            <Chip label="B - Booked" color="primary" size="small" />
            <Chip label="O - Occupied" color="error" size="small" />
            <Chip label="M - Maintenance" color="default" size="small" />
          </Box>
        </Box>
      </Paper>

      {/* Calendar */}
      <Paper sx={{ p: 1.5 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Box
              key={day}
              sx={{
                py: 1,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 13,
                borderRadius: 1,
                backgroundColor: "#1f2937",
                color: "white",
              }}
            >
              {day}
            </Box>
          ))}

          {calendarDays.map((dayCell) => {
            const summary = getDaySummary(dayCell.date);
            const dayBookings = getBookingsForDate(dayCell.date);
            const selected = isSameDay(dayCell.date, selectedDate);

            return (
              <Card
                key={formatDateKey(dayCell.date)}
                onClick={() => setSelectedDate(dayCell.date)}
                sx={{
                  height: 105,
                  cursor: "pointer",
                  border: selected
                    ? "2px solid #1976d2"
                    : "1px solid #e5e7eb",
                  backgroundColor: dayCell.isCurrentMonth ? "white" : "#f3f4f6",
                  opacity: dayCell.isCurrentMonth ? 1 : 0.45,
                  boxShadow: selected ? 3 : 0,
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ p: 1, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: isToday(dayCell.date) ? "#1976d2" : "inherit",
                      }}
                    >
                      {dayCell.date.getDate()}
                    </Typography>

                    {isToday(dayCell.date) && (
                      <Chip label="Today" color="primary" size="small" />
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: 11,
                        color: "#2e7d32",
                        fontWeight: "bold",
                      }}
                    >
                      A: {summary.available}
                    </Box>

                    <Box
                      sx={{
                        fontSize: 11,
                        color: "#1976d2",
                        fontWeight: "bold",
                      }}
                    >
                      B: {summary.booked}
                    </Box>

                    <Box
                      sx={{
                        fontSize: 11,
                        color: "#d32f2f",
                        fontWeight: "bold",
                      }}
                    >
                      O: {summary.occupied}
                    </Box>

                    <Box
                      sx={{
                        fontSize: 11,
                        color: "#616161",
                        fontWeight: "bold",
                      }}
                    >
                      M: {summary.maintenance}
                    </Box>
                  </Box>

                  {dayBookings.length > 0 && (
                    <Box
                      sx={{
                        mt: 0.5,
                        px: 0.7,
                        py: 0.3,
                        borderRadius: 1,
                        backgroundColor: isToday(dayCell.date)
                          ? "#ffebee"
                          : "#e3f2fd",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {dayBookings.length} booking
                      {dayBookings.length > 1 ? "s" : ""}
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Paper>

      {/* Selected Date Details */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Selected Date Details</Typography>

        <Typography color="text.secondary" sx={{ mb: 1 }}>
          {selectedDate.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        {selectedDateBookings.length === 0 ? (
          <Typography color="text.secondary">
            No bookings for this date.
          </Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 1 }}>
            {selectedDateBookings.map((booking) => (
              <Paper
                key={booking.id}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderLeft: isToday(selectedDate)
                    ? "5px solid #d32f2f"
                    : "5px solid #1976d2",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Room {booking.room?.roomNumber} - {booking.room?.roomType}
                    </Typography>

                    <Typography color="text.secondary">
                      Guest: {booking.guestName}
                    </Typography>

                    <Typography color="text.secondary">
                      NIC/Passport: {booking.nicPassport}
                    </Typography>
                  </Box>

                  <Box>
                    {/* APPLIED THE HELPER FUNCTION HERE */}
                    <Typography color="text.secondary">
                      Check In: {formatCustomDateTime(booking.checkIn)}
                    </Typography>

                    <Typography color="text.secondary">
                      Check Out: {formatCustomDateTime(booking.checkOut)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default OccupancyMatrixPage;