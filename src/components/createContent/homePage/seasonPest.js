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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SeasonPest = () => {
  const [pests, setPests] = useState({});
  const [editMonth, setEditMonth] = useState(null);
  const [form, setForm] = useState({
    pestName: "",
    images: [],
    month: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pestToDelete, setPestToDelete] = useState(null);

  useEffect(() => {
    fetchPests();
  }, []);

  const fetchPests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:5000/api/pests", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const fetchedPests = response.data.reduce((acc, pest) => {
        acc[pest.month] = pest;
        return acc;
      }, {});
      setPests(fetchedPests);
    } catch (e) {
      console.error('Error fetching pests:', e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({
        ...form,
        images: Array.from(files),
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleAddPest = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pestName", form.pestName);
    formData.append("month", form.month);

    form.images.forEach((image, index) => {
      formData.append("images", image, image.name);
    });

    try {
      const token = localStorage.getItem('token');
      if (editMonth) {
        formData.append("id", pests[editMonth]._id);
        await axios.post(`http://localhost:5000/api/pests`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
      } else {
        await axios.post("http://localhost:5000/api/pests", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
      }
      fetchPests();
      setForm({ pestName: "", images: [], month: "" });
      setEditMonth(null);
    } catch (error) {
      console.error("Error adding/updating pest:", error);
    }
  };

  const handleEditPest = (month) => {
    const pestToEdit = pests[month];
    setForm({
      pestName: pestToEdit.pestName,
      images: [],
      month,
    });
    setEditMonth(month);
  };

  const handleOpenDeleteDialog = (month) => {
    setPestToDelete(month);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPestToDelete(null);
  };

  const handleDeletePest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/pests/${pests[pestToDelete]._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      fetchPests();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting pest:", error);
    }
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            SeasonPest
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div style={{ padding: 20 }}>
        <form onSubmit={handleAddPest}>
          <FormControl style={{ marginRight: 10 }}>
            <InputLabel>Month</InputLabel>
            <Select
              name="month"
              value={form.month}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Pest Name"
            name="pestName"
            value={form.pestName}
            onChange={handleInputChange}
            required
            style={{ marginRight: 10 }}
          />
          <input
            type="file"
            name="images"
            onChange={handleInputChange}
            required={!editMonth}
            multiple
            style={{ marginRight: 10 }}
          />
          <Button type="submit" variant="contained" color="primary">
            {editMonth ? "Update" : "Save"}
          </Button>
        </form>
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", maxWidth: 20 }}>Month Name</TableCell>
                <TableCell style={{ fontWeight: "bold", maxWidth: 20 }}>Created Date</TableCell>
                <TableCell style={{ fontWeight: "bold", maxWidth: 20 }}>Pest Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Images</TableCell>
                <TableCell style={{ fontWeight: "bold", maxWidth: 20 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {months.map((month) => (
                <TableRow key={month}>
                  <TableCell>{month}</TableCell>
                  <TableCell>{pests[month] && new Date(pests[month].createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>{pests[month]?.pestName}</TableCell>
                  <TableCell>
                    {pests[month]?.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/api/pests/${pests[month]._id}/image/${image._id}`}
                        alt={pests[month].pestName}
                        width="50"
                        style={{ marginRight: 10 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditPest(month)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(month)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this pest?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePest} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SeasonPest;
