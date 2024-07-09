import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Box, Button, Grid} from '@mui/material';
import { Search } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const MainTable = () => {
  const [rows, setRows] = useState([{ id: 1, date: new  Date().toLocaleString(),  columns: Array(15).fill('') }]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (index, columnIndex, value) => {
    const newRows = [...rows];
    newRows[index].columns[columnIndex] = value;
    setRows(newRows);
  };

  const handleSaveSubmit = (index) => {
    // Save and submit logic goes here

    // Add a new empty row
    setRows([...rows, { id: rows.length + 1,date:new Date().toLocaleString(), columns: Array(15).fill('') }]);
  };
  const handleDeleteRow = (index) =>{
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRows = rows.filter(row => row.columns.some(column => column.includes(searchTerm)));

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, p: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            )
          }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.no</TableCell>
              <TableCell>Date</TableCell>
              {Array.from({ length: 14 }).map((_, index) => (
                <TableCell key={index}>Column {index + 3}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, rowIndex) => (
              <TableRow key={row.id}>
                <TableCell>{rowIndex + 1}</TableCell>
                <TableCell>{row.date}</TableCell>
                {row.columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    <TextField
                      variant="outlined"
                      value={column}
                      onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                 <Grid container spacing={1}>
                  <Grid item>
                  <Button
                    variant='contained'
                    onClick={() => handleSaveSubmit(rowIndex)}>
                    <SaveIcon/> save
                  </Button>
                  </Grid>
                  <Grid item>

                  <Button
                  variant='contained'
                    onClick={() => handleDeleteRow(rowIndex)}>
                    <DeleteIcon/> Delete
                  </Button>
                  </Grid>
                 </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
   
  );
};

export default MainTable;
