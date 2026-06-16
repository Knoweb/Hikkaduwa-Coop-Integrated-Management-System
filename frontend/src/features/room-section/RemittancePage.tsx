import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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

type Remittance = {
  id: string;
  remittanceDate: string;
  totalCollected: number;
  receptionistId: string;
  createdAt?: string;
  invoiceTotal?: number;
  difference?: number;
};

const TEMP_RECEPTIONIST_ID = "00000000-0000-0000-0000-000000000001";

function RemittancePage() {
  const [remittances, setRemittances] = useState<Remittance[]>([]);
  const [remittanceDate, setRemittanceDate] = useState("");
  const [totalCollected, setTotalCollected] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRemittances = async () => {
    try {
      const response = await fetch(`${API_BASE_URLS.roomSection}/remittances`);

      if (!response.ok) {
        throw new Error("Failed to load remittances");
      }

      const data = await response.json();
      setRemittances(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load remittances. Check room-section-service.");
    }
  };

  useEffect(() => {
    loadRemittances();
  }, []);

  const handleCreateRemittance = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!remittanceDate || !totalCollected) {
      setError("Please enter remittance date and total collected amount.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URLS.roomSection}/remittances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          remittanceDate,
          totalCollected: Number(totalCollected),
          receptionistId: TEMP_RECEPTIONIST_ID,
        }),
      });

      if (!response.ok) {
        throw new Error("Remittance create failed");
      }

      setRemittanceDate("");
      setTotalCollected("");

      await loadRemittances();

      setMessage("Daily remittance recorded successfully.");
    } catch (err) {
      console.error(err);
      setError("Remittance create failed. Maybe this date is already recorded.");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Daily Remittance
      </Typography>

      <Typography color="text.secondary">
        Record daily room section collections and view remittance history.
      </Typography>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Daily Remittance
          </Typography>

          <Box component="form" onSubmit={handleCreateRemittance}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr auto",
                },
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                label="Remittance Date"
                type="date"
                fullWidth
                value={remittanceDate}
                onChange={(e) => setRemittanceDate(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                label="Total Collected Amount"
                type="number"
                fullWidth
                value={totalCollected}
                onChange={(e) => setTotalCollected(e.target.value)}
                placeholder="Example: 25000"
              />

              <Button type="submit" variant="contained">
                Save
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Remittance History
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Total Collected</TableCell>
              <TableCell>Invoice Total</TableCell>
              <TableCell>Difference</TableCell>
              <TableCell>Receptionist ID</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {remittances.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.remittanceDate}</TableCell>
                <TableCell>Rs. {item.totalCollected}</TableCell>
                <TableCell>
                  {item.invoiceTotal !== undefined
                    ? `Rs. ${item.invoiceTotal}`
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.difference !== undefined ? `Rs. ${item.difference}` : "-"}
                </TableCell>
                <TableCell>{item.receptionistId}</TableCell>
              </TableRow>
            ))}

            {remittances.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>No remittance records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

export default RemittancePage;