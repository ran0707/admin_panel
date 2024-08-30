import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Menu, IconButton, MenuItem, Button, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton as MuiIconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const HomePageMain = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [label, setLabel] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [open, setOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/recom-treatment/recommendation');
            setRecommendations(response.data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleMenuClose();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/create-content');
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setLabel('');
        setSymptoms('');
        setRecommendation('');
        setEditIndex(null);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');

        try {
            if (editIndex !== null) {
                // Edit existing recommendation
                await axios.put(`http://localhost:5000/api/recom-treatment/${recommendations[editIndex]._id}`, {
                    label, symptoms, recommendation
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                // Add new recommendation
                await axios.post('http://localhost:5000/api/recom-treatment', {
                    label, symptoms, recommendation
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            fetchRecommendations();
            handleClose();
        } catch (error) {
            console.error('There was an error saving the data!', error);
        }
    };

    const handleEdit = (index) => {
        setLabel(recommendations[index].label);
        setSymptoms(recommendations[index].symptoms);
        setRecommendation(recommendations[index].recommendation);
        setEditIndex(index);
        setOpen(true);
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`http://localhost:5000/api/recom-treatment/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchRecommendations();
            setDeleteDialogOpen(false);
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting recommendation:', error);
        }
    };

    const openDeleteDialog = (id) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeleteId(null);
    };

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                        Homepage content
                    </Typography>
                    <Button color='inherit' LinkComponent={Link} to='/recentreport-page'>RecentReport</Button>
                    <Button color='inherit' LinkComponent={Link} to='/seasonpest-page'>SeasonPest</Button>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>

                    <Box sx={{ m: 2 }}></Box>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => handleNavigation('/cultivation-main')}>CultivationPage</MenuItem>
                        <MenuItem onClick={() => handleNavigation('/cemillia-community')}>CommunityPage</MenuItem>
                        <MenuItem onClick={() => handleNavigation('/vendors-main')}>vendors</MenuItem>

                    </Menu>
                </Toolbar>
            </AppBar>

            <Box mt={10} p={2}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Recommendation
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editIndex !== null ? "Edit Recommendation" : "Add Recommendation"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Label"
                            fullWidth
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Symptoms"
                            multiline
                            fullWidth
                            rows={4}
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Recommendation"
                            multiline
                            fullWidth
                            rows={4}
                            value={recommendation}
                            onChange={(e) => setRecommendation(e.target.value)}
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Label Name</TableCell>
                                <TableCell>Symptoms</TableCell>
                                <TableCell>Recommendation</TableCell>
                                <TableCell>Edit</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recommendations.map((recommendation, index) => (
                                <TableRow key={recommendation._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{new Date(recommendation.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{recommendation.label}</TableCell>
                                    <TableCell>
                                        <TextField
                                            value={recommendation.symptoms}
                                            multiline
                                            fullWidth
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={recommendation.recommendation}
                                            multiline
                                            fullWidth
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <MuiIconButton onClick={() => handleEdit(index)}>
                                            <EditIcon />
                                        </MuiIconButton>
                                    </TableCell>
                                    <TableCell>
                                        <MuiIconButton onClick={() => openDeleteDialog(recommendation._id)}>
                                            <DeleteIcon />
                                        </MuiIconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this recommendation?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default HomePageMain;
