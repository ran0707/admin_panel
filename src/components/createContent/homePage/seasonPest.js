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
    form.images.forEach((image) => {
      formData.append("images", image);
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

  const handleDeletePest = async (month) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/pests/${pests[month]._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      fetchPests();
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
          <FormControl style={{ marginRight: 10, minWidth: 120 , position:'sticky'}}>
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
                <TableCell style={{fontWeight:"bold"}}>Month Name</TableCell>
                {/* <TableCell>ID</TableCell> */}
                <TableCell style={{fontWeight:"bold"}}>Created Date</TableCell>
                <TableCell style={{fontWeight:"bold"}}>Pest Name</TableCell>
                <TableCell style={{fontWeight:"bold"}}>Images</TableCell>
                <TableCell style={{fontWeight:"bold"}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {months.map((month) => (
                <TableRow key={month}>
                  <TableCell>{month}</TableCell>
                  {/* <TableCell>{pests[month]?._id}</TableCell> */}
                  <TableCell>{pests[month] && new Date(pests[month].createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>{pests[month]?.pestName}</TableCell>
                  <TableCell>
                    {pests[month]?.images.map((image, index) => (
                      <img
                        key={index}
                        src={`uploads/${image}`}
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
                    <IconButton onClick={() => handleDeletePest(month)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SeasonPest;
