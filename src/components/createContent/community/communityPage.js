import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

const CommunityPageManager = () => {
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/community/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTitle('');
        setContent('');
        setEditIndex(null);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');

        try {
            if (editIndex !== null) {
                // Edit existing post
                await axios.put(`http://localhost:5000/api/community/posts/${posts[editIndex]._id}`, {
                    title, content
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                // Add new post
                await axios.post('http://localhost:5000/api/community/posts', {
                    title, content
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            fetchPosts();
            handleClose();
        } catch (error) {
            console.error('There was an error saving the data!', error);
        }
    };

    const handleEdit = (index) => {
        setTitle(posts[index].title);
        setContent(posts[index].content);
        setEditIndex(index);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`http://localhost:5000/api/community/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                        Manage Community Page
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box mt={10} p={2}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add Post
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editIndex !== null ? "Edit Post" : "Add Post"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Title"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Content"
                            multiline
                            fullWidth
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
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
                                <TableCell>Title</TableCell>
                                <TableCell>Content</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell>Edit</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {posts.map((post, index) => (
                                <TableRow key={post._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{post.title}</TableCell>
                                    <TableCell>
                                        <TextField
                                            value={post.content}
                                            multiline
                                            fullWidth
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(index)}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDelete(post._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
}

export default CommunityPageManager;
