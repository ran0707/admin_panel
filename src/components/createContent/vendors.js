import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";

const VendorsMain = () => {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    description: "",
    rating: "",
  });
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/vendors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSaveVendor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/vendors/${editId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post("http://localhost:5000/api/vendors", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      fetchVendors();
      handleClose();
    } catch (error) {
      console.error("Error saving vendor:", error);
    }
  };

  const handleEditVendor = (vendor) => {
    setForm({
      name: vendor.name,
      imageUrl: vendor.imageUrl,
      description: vendor.description,
      rating: vendor.rating,
    });
    setEditId(vendor._id);
    setOpen(true);
  };

  const handleDeleteVendor = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/vendors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const handleOpen = () => {
    setForm({
      name: "",
      imageUrl: "",
      description: "",
      rating: "",
    });
    setEditId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            Vendors
          </Typography>
          <Button color="inherit" onClick={handleOpen}>
            Add Vendor
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div style={{ padding: 20 }}>
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell>{vendor._id}</TableCell>
                  <TableCell>{new Date(vendor.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>
                    <img src={vendor.imageUrl} alt={vendor.name} style={{ width: "50px" }} />
                  </TableCell>
                  <TableCell>{vendor.description}</TableCell>
                  <TableCell>{vendor.rating}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditVendor(vendor)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteVendor(vendor._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Image URL"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Rating"
              name="rating"
              type="number"
              value={form.rating}
              onChange={handleInputChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveVendor} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default VendorsMain;
