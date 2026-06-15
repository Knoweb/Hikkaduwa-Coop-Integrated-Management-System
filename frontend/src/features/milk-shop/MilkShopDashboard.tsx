import { Card, CardContent, Grid, Typography } from "@mui/material";

function MilkShopDashboard() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Milk Shop
      </Typography>

      <Typography color="text.secondary" gutterBottom>
        Manage suppliers, items, stock ledger, GRN, and daily sales.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Suppliers</Typography>
              <Typography color="text.secondary">
                Add and view Milk Shop suppliers.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Stock Ledger</Typography>
              <Typography color="text.secondary">
                View current stock and low-stock alerts.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">GRN</Typography>
              <Typography color="text.secondary">
                Create Goods Received Notes and update stock.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default MilkShopDashboard;