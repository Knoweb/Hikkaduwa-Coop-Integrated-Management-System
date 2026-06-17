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

function RoomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("AC");
  const [basePrice, setBasePrice] = useState("");
  const [status, setStatus] = useState("AVAILABLE");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState("");
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editRoomType, setEditRoomType] = useState("AC");
  const [editBasePrice, setEditBasePrice] = useState("");
  const [editStatus, setEditStatus] = useState("AVAILABLE");

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

      const data: Room[] = await response.json();

      const sortedRooms = data.sort((a, b) =>
        a.roomNumber.localeCompare(b.roomNumber, undefined, {
          numeric: true,
        })
      );

      setRooms(sortedRooms);
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

  const openEditDialog = (room: Room) => {
    setEditingRoomId(room.id);
    setEditRoomNumber(room.roomNumber);
    setEditRoomType(room.roomType);
    setEditBasePrice(String(room.basePrice));
    setEditStatus(room.status);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingRoomId("");
    setEditRoomNumber("");
    setEditRoomType("AC");
    setEditBasePrice("");
    setEditStatus("AVAILABLE");
  };

  const handleUpdateRoom = async () => {
    if (!editingRoomId || !editRoomNumber || !editBasePrice) {
      setError("Please fill all room details.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URLS.roomSection}/${editingRoomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomNumber: editRoomNumber,
          roomType: editRoomType,
          basePrice: Number(editBasePrice),
          status: editStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Room update failed");
      }

      closeEditDialog();
      await loadRooms();
      setMessage("Room details updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Room update failed. Maybe room number already exists.");
    }
  };

  const getStatusColor = (roomStatus: string): ChipColor => {
    if (roomStatus === "AVAILABLE") return "success";
    if (roomStatus === "OCCUPIED") return "error";
    if (roomStatus === "MAINTENANCE") return "warning";

    return "default";
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Room Management
      </Typography>

      <Typography color="text.secondary">
        Add rooms, edit room details, and update room status.
      </Typography>

      <Card
        sx={{
          mt: 3,
          maxWidth: 950,
          mx: "auto",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add New Room
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Enter room details and save the room into the Room Section module.
          </Typography>

          <Box component="form" onSubmit={handleCreateRoom}>
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
                label="Room Number"
                fullWidth
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Example: 01"
              />

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

              <TextField
                label="Base Price"
                type="number"
                fullWidth
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="Example: 8000"
              />

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
                <Button type="submit" variant="contained" size="large"
                sx={{backgroundColor: "#f97316",color: "white","&:hover": {backgroundColor: "#ea580c",},}}>
                  Add Room
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h5" gutterBottom>
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
                <TableCell>Current Status</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.roomNumber}</TableCell>

                  <TableCell>{room.roomType}</TableCell>

                  <TableCell>Rs. {room.basePrice}</TableCell>

                  <TableCell>
                    <Chip
                      label={room.status}
                      color={getStatusColor(room.status)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => openEditDialog(room)}
                      sx={{fontWeight: 'bold',backgroundColor: "#de6f40",color: "white","&:hover": { backgroundColor: "#ea580c",},}}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {rooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>No rooms found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={editDialogOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Room Details</DialogTitle>

        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField
              label="Room Number"
              fullWidth
              value={editRoomNumber}
              onChange={(e) => setEditRoomNumber(e.target.value)}
            />

            <TextField
              select
              label="Room Type"
              fullWidth
              value={editRoomType}
              onChange={(e) => setEditRoomType(e.target.value)}
            >
              <MenuItem value="AC">AC</MenuItem>
              <MenuItem value="NON_AC">NON AC</MenuItem>
            </TextField>

            <TextField
              label="Base Price"
              type="number"
              fullWidth
              value={editBasePrice}
              onChange={(e) => setEditBasePrice(e.target.value)}
            />

            <TextField
              select
              label="Status"
              fullWidth
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
              <MenuItem value="OCCUPIED">OCCUPIED</MenuItem>
              <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>

          <Button variant="contained" onClick={handleUpdateRoom}>
            Save Changes
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

export default RoomPage;