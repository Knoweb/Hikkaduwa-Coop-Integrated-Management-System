import { Card, CardContent, Grid, Typography } from "@mui/material";

function DashboardPage() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Milk Shop Module</Typography>
              <Typography color="text.secondary">
                Supplier, item, stock, GRN, and daily sales management.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Room Section Module</Typography>
              <Typography color="text.secondary">
                Room management, booking, availability, and daily remittance.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default DashboardPage;