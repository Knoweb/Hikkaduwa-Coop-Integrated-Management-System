import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import {
  Alert,
  Box,
  Button,
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

type MoneyValue = number | string | undefined;

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

const TEMP_RECEPTIONIST_ID = "00000000-0000-0000-0000-000000000001";

const formatMoney = (value: MoneyValue) => {
  return Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

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

      const data: Remittance[] = await response.json();

      const sortedData = data.sort((a, b) => {
        return (
          new Date(b.remittanceDate).getTime() -
          new Date(a.remittanceDate).getTime()
        );
      });

      setRemittances(sortedData);
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

      const savedData: Remittance = await response.json();

      setRemittanceDate("");
      setTotalCollected("");

      await loadRemittances();

      setMessage(savedData.message || "Daily remittance recorded successfully.");
    } catch (err) {
      console.error(err);
      setError("Remittance create failed. Maybe this date is already recorded.");
    }
  };

  const getDiscrepancyColor = (discrepancy: MoneyValue): ChipColor => {
    const value = Number(discrepancy || 0);

    if (value === 0) {
      return "success";
    }

    if (value < 0) {
      return "error";
    }

    return "warning";
  };

  const getDiscrepancyLabel = (discrepancy: MoneyValue) => {
    const value = Number(discrepancy || 0);

    if (value === 0) {
      return "Balanced";
    }

    if (value < 0) {
      return "Short";
    }

    return "Extra";
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Daily Remittance
      </Typography>

      <Typography color="text.secondary">
        Record daily room collections and compare actual collection with system
        invoice total.
      </Typography>

      <Card
        sx={{
          mt: 3,
          maxWidth: 750,
          mx: "auto",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add Daily Remittance
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Select the date and enter the actual amount collected by the room
            section.
          </Typography>

          <Box component="form" onSubmit={handleCreateRemittance}>
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
                <Button type="submit" variant="contained" size="large">
                  Save Remittance
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Remittance History
        </Typography>

        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Expected Invoice Total</TableCell>
                <TableCell>Total Collected</TableCell>
                <TableCell>Difference</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Receptionist ID</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {remittances.map((item) => (
                <TableRow key={item.id || item.remittanceId}>
                  <TableCell>{item.remittanceDate}</TableCell>

                  <TableCell>
                    Rs. {formatMoney(item.expectedInvoiceTotal)}
                  </TableCell>

                  <TableCell>Rs. {formatMoney(item.totalCollected)}</TableCell>

                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color:
                        Number(item.discrepancy || 0) < 0
                          ? "error.main"
                          : Number(item.discrepancy || 0) > 0
                          ? "warning.main"
                          : "success.main",
                    }}
                  >
                    Rs. {formatMoney(item.discrepancy)}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getDiscrepancyLabel(item.discrepancy)}
                      color={getDiscrepancyColor(item.discrepancy)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>{item.message}</TableCell>

                  <TableCell>{item.receptionistId}</TableCell>
                </TableRow>
              ))}

              {remittances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>No remittance records found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>

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

export default RemittancePage;