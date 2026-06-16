import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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

type Room = {
  id: string;
  roomNumber: string;
  roomType: string;
  basePrice: number;
  status: string;
};

function RoomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("AC");
  const [basePrice, setBasePrice] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRooms = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_BASE_URLS.roomSection);

      if (!response.ok) {
        throw new Error("Failed to load rooms");
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load rooms. Check room-section-service on port 8084.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreateRoom = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!roomNumber || !basePrice) {
      setError("Please enter room number and base price.");
      return;
    }

    try {
      const response = await fetch(API_BASE_URLS.roomSection, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomNumber,
          roomType,
          basePrice: Number(basePrice),
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Room create failed");
      }

      setRoomNumber("");
      setRoomType("AC");
      setBasePrice("");
      setStatus("AVAILABLE");

      await loadRooms();
      setMessage("Room created successfully.");
    } catch (err) {
      console.error(err);
      setError("Room create failed. Maybe room number already exists.");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Room Section
      </Typography>

      <Typography color="text.secondary" gutterBottom>
        Manage A/C and Non-A/C rooms.
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Room
          </Typography>

          <Box component="form" onSubmit={handleCreateRoom}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  label="Room Number"
                  fullWidth
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Example: 101"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  select
                  label="Room Type"
                  fullWidth
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <MenuItem value="AC">AC</MenuItem>
                  <MenuItem value="NON_AC">NON AC</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  label="Base Price"
                  type="number"
                  fullWidth
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="Example: 8000"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  select
                  label="Status"
                  fullWidth
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
                  <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
                  <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button type="submit" variant="contained">
                  Add Room
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Room List
        </Typography>

        {loading ? (
          <Typography>Loading rooms...</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room No</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Base Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>{room.roomType}</TableCell>
                  <TableCell>Rs. {room.basePrice}</TableCell>
                  <TableCell>{room.status}</TableCell>
                </TableRow>
              ))}

              {rooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>No rooms found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage("")}>
        <Alert severity="success" onClose={() => setMessage("")}>
          {message}
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RoomPage;