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

type ItemProduct = {
  id: string;
  name: string;
  category: string;
  reorderLevel: number;
  unitPrice: number;
  isActive?: boolean;
};

const categories = [
  "Milk",
  "Yoghurt",
  "Curd",
  "Butter",
  "Cheese",
  "Ice Cream",
  "Other",
];

const formatMoney = (value: number | string | undefined) => {
  return Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function ItemPage() {
  const [items, setItems] = useState<ItemProduct[]>([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Milk");
  const [reorderLevel, setReorderLevel] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState("");
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Milk");
  const [editReorderLevel, setEditReorderLevel] = useState("");
  const [editUnitPrice, setEditUnitPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URLS.milkShop}/items`);

      if (!response.ok) {
        throw new Error("Failed to load items");
      }

      const data: ItemProduct[] = await response.json();

      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

      setItems(sortedData);
    } catch (err) {
      console.error(err);
      setError("Failed to load items. Check milk-shop-service on port 8082.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleCreateItem = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !category || !reorderLevel || !unitPrice) {
      setError("Please fill all item details.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URLS.milkShop}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          reorderLevel: Number(reorderLevel),
          unitPrice: Number(unitPrice),
        }),
      });

      if (!response.ok) {
        throw new Error("Item create failed");
      }

      setName("");
      setCategory("Milk");
      setReorderLevel("");
      setUnitPrice("");

      await loadItems();

      setMessage("Item created successfully.");
    } catch (err) {
      console.error(err);
      setError("Item create failed. Check backend API.");
    }
  };

  const openEditDialog = (item: ItemProduct) => {
    setEditingItemId(item.id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditReorderLevel(String(item.reorderLevel));
    setEditUnitPrice(String(item.unitPrice));
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingItemId("");
    setEditName("");
    setEditCategory("Milk");
    setEditReorderLevel("");
    setEditUnitPrice("");
  };

  const handleUpdateItem = async () => {
    if (!editingItemId || !editName || !editCategory || !editReorderLevel || !editUnitPrice) {
      setError("Please fill all item details.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URLS.milkShop}/items/${editingItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName,
            category: editCategory,
            reorderLevel: Number(editReorderLevel),
            unitPrice: Number(editUnitPrice),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Item update failed");
      }

      closeEditDialog();
      await loadItems();

      setMessage("Item updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Item update failed. Check backend API.");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Item / Product Management
      </Typography>

      <Typography color="text.secondary">
        Add, view, and update Milk Shop items. Stock quantity will be updated later through GRN and sales.
      </Typography>

      <Card
        sx={{
          mt: 3,
          maxWidth: 900,
          mx: "auto",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add New Item
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Create products before entering GRN or daily sales records.
          </Typography>

          <Box component="form" onSubmit={handleCreateItem}>
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
                label="Item Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Example: Fresh Milk 1L"
              />

              <TextField
                select
                label="Category"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((itemCategory) => (
                  <MenuItem key={itemCategory} value={itemCategory}>
                    {itemCategory}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Unit Price"
                type="number"
                fullWidth
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="Example: 450"
              />

              <TextField
                label="Reorder Level"
                type="number"
                fullWidth
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
                placeholder="Example: 10"
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
                  Add Item
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Item List
        </Typography>

        {loading ? (
          <Typography>Loading items...</Typography>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Reorder Level</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>Rs. {formatMoney(item.unitPrice)}</TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.isActive === false ? "INACTIVE" : "ACTIVE"}
                        color={item.isActive === false ? "default" : "success"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => openEditDialog(item)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>No items found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      <Dialog
        open={editDialogOpen}
        onClose={closeEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Item</DialogTitle>

        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField
              label="Item Name"
              fullWidth
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <TextField
              select
              label="Category"
              fullWidth
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              {categories.map((itemCategory) => (
                <MenuItem key={itemCategory} value={itemCategory}>
                  {itemCategory}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Unit Price"
              type="number"
              fullWidth
              value={editUnitPrice}
              onChange={(e) => setEditUnitPrice(e.target.value)}
            />

            <TextField
              label="Reorder Level"
              type="number"
              fullWidth
              value={editReorderLevel}
              onChange={(e) => setEditReorderLevel(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>

          <Button variant="contained" onClick={handleUpdateItem}>
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

export default ItemPage;