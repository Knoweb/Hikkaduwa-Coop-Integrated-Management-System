import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import type { Booking, MoneyValue } from "../BookingPage";

type Props = {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onError: (message: string) => void;
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

const formatMoney = (value: MoneyValue) => {
  return Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function BookingInvoiceDialog({ open, booking, onClose, onError }: Props) {
  if (!booking) return null;

  const roomCharge =
    Number(booking.room?.basePrice || 0) * Number(booking.noOfDays || 0);

  const balance =
    Number(booking.totalDue || 0) -
    Number(booking.advancePayment || 0) -
    Number(booking.finalPaymentAmount || 0);

  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      onError("Print window blocked. Please allow popups.");
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
              max-width: 750px;
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
              width: 42%;
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
            <h2>Hikkaduwa COOP Integrated Management System</h2>
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
                <td class="label">Nights</td>
                <td>${booking.noOfDays || 0}</td>
              </tr>

              <tr>
                <td class="label">Extra Hours</td>
                <td>${booking.extraHours || 0}</td>
              </tr>

              <tr>
                <td class="label">Room Charge</td>
                <td>Rs. ${formatMoney(roomCharge)}</td>
              </tr>

              <tr>
                <td class="label">Extra Hour Charge</td>
                <td>Rs. ${formatMoney(booking.extraHourCharge)}</td>
              </tr>

              <tr>
                <td class="label">Sub Total</td>
                <td>Rs. ${formatMoney(booking.subTotal)}</td>
              </tr>

              <tr>
                <td class="label">Tax (${formatMoney(booking.vatRate)}% VAT + ${formatMoney(
      booking.ssclRate
    )}% SSCL)</td>
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
                <td class="label">Final Payment</td>
                <td>Rs. ${formatMoney(booking.finalPaymentAmount)}</td>
              </tr>

              <tr>
                <td class="label">Payment Status</td>
                <td>${booking.paymentStatus || "PARTIAL"}</td>
              </tr>

              <tr>
                <td class="label total">Balance Amount</td>
                <td class="total">Rs. ${formatMoney(balance)}</td>
              </tr>

              <tr>
                <td class="label">Booking Status</td>
                <td>${booking.status}</td>
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Booking Invoice / Receipt
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" gutterBottom>
            Hikkaduwa Coop - Room Section
          </Typography>

          <Typography color="text.secondary" gutterBottom>
            Room Booking Receipt
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "grid", gap: 1 }}>
            <Typography>
              <strong>Room:</strong> {booking.room?.roomNumber} -{" "}
              {booking.room?.roomType}
            </Typography>

            <Typography>
              <strong>Guest:</strong> {booking.guestName}
            </Typography>

            <Typography>
              <strong>NIC / Passport:</strong> {booking.nicPassport}
            </Typography>

            <Typography>
              <strong>Check In:</strong> {formatDateTime(booking.checkIn)}
            </Typography>

            <Typography>
              <strong>Check Out:</strong> {formatDateTime(booking.checkOut)}
            </Typography>

            <Typography>
              <strong>Nights:</strong> {booking.noOfDays || 0}
            </Typography>

            <Typography>
              <strong>Extra Hours:</strong> {booking.extraHours || 0}
            </Typography>

            <Typography>
              <strong>Booking Status:</strong> {booking.status}
            </Typography>

            <Typography>
              <strong>Payment Status:</strong>{" "}
              {booking.paymentStatus || "PARTIAL"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "grid", gap: 1 }}>
            <Typography>
              <strong>Room Charge:</strong> Rs. {formatMoney(roomCharge)}
            </Typography>

            <Typography>
              <strong>Extra Hour Charge:</strong> Rs.{" "}
              {formatMoney(booking.extraHourCharge)}
            </Typography>

            <Typography>
              <strong>Sub Total:</strong> Rs. {formatMoney(booking.subTotal)}
            </Typography>

            <Typography>
              <strong>
                Tax ({formatMoney(booking.vatRate)}% VAT +{" "}
                {formatMoney(booking.ssclRate)}% SSCL):
              </strong>{" "}
              Rs. {formatMoney(booking.taxAmount)}
            </Typography>

            <Typography>
              <strong>Total Due:</strong> Rs. {formatMoney(booking.totalDue)}
            </Typography>

            <Typography>
              <strong>Advance Payment:</strong> Rs.{" "}
              {formatMoney(booking.advancePayment)}
            </Typography>

            <Typography>
              <strong>Final Payment:</strong> Rs.{" "}
              {formatMoney(booking.finalPaymentAmount)}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Balance Amount: Rs. {formatMoney(balance)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>

        <Button variant="contained" onClick={handlePrintInvoice}>
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BookingInvoiceDialog;