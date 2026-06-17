import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
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

const formatMoney = (value: number | undefined) => {
  return Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function BookingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);

  const [roomId, setRoomId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [nicPassport, setNicPassport] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [advancePayment, setAdvancePayment] = useState("");

  const [selectedInvoiceBooking, setSelectedInvoiceBooking] =
    useState<Booking | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRooms = async () => {
    try {
      const response = await fetch(API_BASE_URLS.roomSection);

      if (!response.ok) {
        throw new Error("Failed to load rooms");
      }

      const data: Room[] = await response.json();

      const sortedRooms = data.sort((a, b) => {
        return Number(a.roomNumber) - Number(b.roomNumber);
      });

      setRooms(sortedRooms);
    } catch (err) {
      console.error(err);
      setError("Failed to load rooms. Check room backend.");
    }
  };

  const loadBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URLS.roomSection}/bookings`);

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const data: Booking[] = await response.json();

      const sortedBookings = data.sort((a, b) => {
        return new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime();
      });

      setBookings(sortedBookings);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings.");
    }
  };

  useEffect(() => {
    loadRooms();
    loadBookings();
  }, []);

  const resetAvailability = () => {
    setAvailableRooms([]);
    setAvailabilityChecked(false);
    setRoomId("");
  };

  const isBookingOverlapping = (
    existingCheckIn: string,
    existingCheckOut: string,
    newCheckIn: string,
    newCheckOut: string
  ) => {
    const existingStart = new Date(existingCheckIn);
    const existingEnd = new Date(existingCheckOut);
    const newStart = new Date(newCheckIn);
    const newEnd = new Date(newCheckOut);

    return newStart < existingEnd && newEnd > existingStart;
  };

  const handleCheckAvailability = () => {
    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates first.");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    const filteredRooms = rooms.filter((room) => {
      if (room.status === "MAINTENANCE" || room.status === "OCCUPIED") {
        return false;
      }

      const hasActiveBooking = bookings.some((booking) => {
        return (
          booking.status === "ACTIVE" &&
          booking.room?.id === room.id &&
          isBookingOverlapping(
            booking.checkIn,
            booking.checkOut,
            checkIn,
            checkOut
          )
        );
      });

      return !hasActiveBooking;
    });

    setAvailableRooms(filteredRooms);
    setAvailabilityChecked(true);
    setRoomId("");

    if (filteredRooms.length === 0) {
      setError("No rooms are available for the selected date range.");
    } else {
      setMessage(`${filteredRooms.length} room(s) available.`);
    }
  };

  const handleCreateBooking = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!roomId || !guestName || !nicPassport || !checkIn || !checkOut) {
      setError("Please fill all required fields.");
      return;
    }

    if (!availabilityChecked) {
      setError("Please check room availability before creating booking.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URLS.roomSection}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          guestName,
          nicPassport,
          checkIn,
          checkOut,
          advancePayment: Number(advancePayment || 0),
        }),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      setRoomId("");
      setGuestName("");
      setNicPassport("");
      setCheckIn("");
      setCheckOut("");
      setAdvancePayment("");
      setAvailableRooms([]);
      setAvailabilityChecked(false);

      await loadRooms();
      await loadBookings();

      setMessage("Booking created successfully.");
    } catch (err) {
      console.error(err);
      setError("Booking failed. Room may already be booked or unavailable.");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `${API_BASE_URLS.roomSection}/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Cancel failed");
      }

      await loadBookings();
      await loadRooms();

      setMessage("Booking cancelled successfully.");
    } catch (err) {
      console.error(err);
      setError("Cancel booking failed. Only ACTIVE bookings can be cancelled.");
    }
  };

  const handleCheckoutBooking = async (bookingId: string) => {
    const confirmCheckout = window.confirm(
      "Are you sure you want to check-out this booking?"
    );

    if (!confirmCheckout) return;

    try {
      const response = await fetch(
        `${API_BASE_URLS.roomSection}/bookings/${bookingId}/checkout`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Check-out failed");
      }

      await loadBookings();
      await loadRooms();

      setMessage("Booking checked out successfully.");
    } catch (err) {
      console.error(err);
      setError("Check-out failed. Only ACTIVE bookings can be checked out.");
    }
  };

  const getStatusColor = (status: string): ChipColor => {
    if (status === "ACTIVE") return "success";
    if (status === "CANCELLED") return "default";
    if (status === "CHECKED_OUT") return "primary";
    return "warning";
  };

  const calculateBalance = (booking: Booking) => {
    return Number(booking.totalDue || 0) - Number(booking.advancePayment || 0);
  };

  const openInvoiceDialog = (booking: Booking) => {
    setSelectedInvoiceBooking(booking);
  };

  const closeInvoiceDialog = () => {
    setSelectedInvoiceBooking(null);
  };

  const handlePrintInvoice = () => {
    if (!selectedInvoiceBooking) return;

    const booking = selectedInvoiceBooking;
    const balance = calculateBalance(booking);

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setError("Print window blocked. Please allow popups.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Room Booking Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #111827;
            }
            .receipt {
              max-width: 700px;
              margin: auto;
              border: 1px solid #d1d5db;
              padding: 25px;
            }
            h2, h3 {
              text-align: center;
              margin: 5px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            td {
              padding: 8px;
              border-bottom: 1px solid #e5e7eb;
            }
            .label {
              font-weight: bold;
            }
            .total {
              font-size: 18px;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h2>Hikkaduwa Co-op Integrated Management System</h2>
            <h3>Room Booking Receipt</h3>

            <table>
              <tr>
                <td class="label">Room</td>
                <td>${booking.room?.roomNumber} - ${booking.room?.roomType}</td>
              </tr>
              <tr>
                <td class="label">Guest Name</td>
                <td>${booking.guestName}</td>
              </tr>
              <tr>
                <td class="label">NIC / Passport</td>
                <td>${booking.nicPassport}</td>
              </tr>
              <tr>
                <td class="label">Check In</td>
                <td>${formatDateTime(booking.checkIn)}</td>
              </tr>
              <tr>
                <td class="label">Check Out</td>
                <td>${formatDateTime(booking.checkOut)}</td>
              </tr>
              <tr>
                <td class="label">Booking Status</td>
                <td>${booking.status}</td>
              </tr>
              <tr>
                <td class="label">Sub Total</td>
                <td>Rs. ${formatMoney(booking.subTotal)}</td>
              </tr>
              <tr>
                <td class="label">Tax Amount</td>
                <td>Rs. ${formatMoney(booking.taxAmount)}</td>
              </tr>
              <tr>
                <td class="label">Total Due</td>
                <td>Rs. ${formatMoney(booking.totalDue)}</td>
              </tr>
              <tr>
                <td class="label">Advance Payment</td>
                <td>Rs. ${formatMoney(booking.advancePayment)}</td>
              </tr>
              <tr>
                <td class="label total">Balance Amount</td>
                <td class="total">Rs. ${formatMoney(balance)}</td>
              </tr>
            </table>

            <div class="footer">
              This is a system-generated receipt.
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const roomsForDropdown = availabilityChecked ? availableRooms : rooms;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Room Booking
      </Typography>

      <Typography color="text.secondary">
        Create guest bookings, check room availability, cancel bookings,
        check-out guests, and view invoices.
      </Typography>

      <Card
        sx={{
          mt: 3,
          maxWidth: 850,
          mx: "auto",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Create Booking
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Enter guest details and check room availability before creating a
            booking.
          </Typography>

          <Box component="form" onSubmit={handleCreateBooking}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                label="Guest Name"
                fullWidth
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Example: Nimal Perera"
              />

              <TextField
                label="NIC / Passport"
                fullWidth
                value={nicPassport}
                onChange={(e) => setNicPassport(e.target.value)}
                placeholder="Example: 991234567V"
              />

              <TextField
                label="Check In"
                type="datetime-local"
                fullWidth
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  resetAvailability();
                }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                label="Check Out"
                type="datetime-local"
                fullWidth
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  resetAvailability();
                }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <Box
                sx={{
                  gridColumn: {
                    xs: "span 1",
                    md: "span 2",
                  },
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleCheckAvailability}
                >
                  Check Availability
                </Button>
              </Box>

              <TextField
                select
                label="Select Available Room"
                fullWidth
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                disabled={!availabilityChecked}
                helperText={
                  availabilityChecked
                    ? `${availableRooms.length} available room(s) found`
                    : "Select dates and click Check Availability first"
                }
              >
                {roomsForDropdown.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    Room {room.roomNumber} - {room.roomType} - Rs.{" "}
                    {room.basePrice} - {room.status}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Advance Payment"
                type="number"
                fullWidth
                value={advancePayment}
                onChange={(e) => setAdvancePayment(e.target.value)}
                placeholder="Example: 5000"
              />

              <Box
                sx={{
                  gridColumn: {
                    xs: "span 1",
                    md: "span 2",
                  },
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 1,
                }}
              >
                <Button type="submit" variant="contained" size="large">
                  Create Booking
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Booking List
        </Typography>

        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>Guest</TableCell>
                <TableCell>NIC / Passport</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Total Due</TableCell>
                <TableCell>Advance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.room?.roomNumber}</TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>{booking.nicPassport}</TableCell>
                  <TableCell>{formatDateTime(booking.checkIn)}</TableCell>
                  <TableCell>{formatDateTime(booking.checkOut)}</TableCell>
                  <TableCell>Rs. {formatMoney(booking.totalDue)}</TableCell>
                  <TableCell>Rs. {formatMoney(booking.advancePayment)}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openInvoiceDialog(booking)}
                      >
                        Invoice
                      </Button>

                      {booking.status === "ACTIVE" && (
                        <>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>

                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleCheckoutBooking(booking.id)}
                          >
                            Check-out
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9}>No bookings found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      <Dialog
        open={!!selectedInvoiceBooking}
        onClose={closeInvoiceDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Booking Invoice / Receipt</DialogTitle>

        <DialogContent>
          {selectedInvoiceBooking && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" gutterBottom>
                Hikkaduwa Co-op - Room Section
              </Typography>

              <Typography color="text.secondary" gutterBottom>
                Room Booking Receipt
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "grid", gap: 1 }}>
                <Typography>
                  <strong>Room:</strong>{" "}
                  {selectedInvoiceBooking.room?.roomNumber} -{" "}
                  {selectedInvoiceBooking.room?.roomType}
                </Typography>

                <Typography>
                  <strong>Guest:</strong> {selectedInvoiceBooking.guestName}
                </Typography>

                <Typography>
                  <strong>NIC / Passport:</strong>{" "}
                  {selectedInvoiceBooking.nicPassport}
                </Typography>

                <Typography>
                  <strong>Check In:</strong>{" "}
                  {formatDateTime(selectedInvoiceBooking.checkIn)}
                </Typography>

                <Typography>
                  <strong>Check Out:</strong>{" "}
                  {formatDateTime(selectedInvoiceBooking.checkOut)}
                </Typography>

                <Typography>
                  <strong>Status:</strong> {selectedInvoiceBooking.status}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "grid", gap: 1 }}>
                <Typography>
                  <strong>Sub Total:</strong> Rs.{" "}
                  {formatMoney(selectedInvoiceBooking.subTotal)}
                </Typography>

                <Typography>
                  <strong>Tax Amount:</strong> Rs.{" "}
                  {formatMoney(selectedInvoiceBooking.taxAmount)}
                </Typography>

                <Typography>
                  <strong>Total Due:</strong> Rs.{" "}
                  {formatMoney(selectedInvoiceBooking.totalDue)}
                </Typography>

                <Typography>
                  <strong>Advance Payment:</strong> Rs.{" "}
                  {formatMoney(selectedInvoiceBooking.advancePayment)}
                </Typography>

                <Typography variant="h6">
                  Balance Amount: Rs.{" "}
                  {formatMoney(calculateBalance(selectedInvoiceBooking))}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeInvoiceDialog}>Close</Button>
          <Button variant="contained" onClick={handlePrintInvoice}>
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
      >
        <Alert severity="success" onClose={() => setMessage("")}>
          {message}
        </Alert>
      </Snackbar>

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

export default BookingPage;