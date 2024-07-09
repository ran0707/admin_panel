import React, { useState } from 'react';
import {Button, TextField, Box, Container, Typography, styled} from '@mui/material'; // Importing the Button component from Material-UI
import api from '../../utils/api';


const CreateContent = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) {
      formData.append('image', image);
    }

    try {
     
    const response = await api.post('/Content', formData, {
        headers:{
            'Content-Type':'multipart/form-data',
        }
    });
      console.log(response.data);
      // handle success (e.g., clear the form, show a success message)
    } catch (error) {
      console.error('Error creating content:', error);
      // handle error (e.g., show an error message)
    }
  };

  const StyledContainer = styled(Container)({
    marginTop: '2rem',
    padding:'2rem',
    backgroundColor:'#ffffff',
    borderRadius:'10px',
    boxShadow:'0 3px 6px rgba(0,0,0,0.1)',
  });

  const StyledTextField = styled(TextField)({
    marginBottom: '1rem',
  });

 

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Create Content
      </Typography>
      <form onSubmit={handleSubmit}>
        <StyledTextField
          label="Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <StyledTextField
          label="Body"
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <Box mb={2}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Upload Image
            </Button>
            {image && <Typography variant="body2">{image.name}</Typography>}
          </label>
        </Box>
        <Button variant="contained" color="primary" type="submit">
          Create Content
        </Button>
      </form>
    </StyledContainer>
  );
};

export default CreateContent;
