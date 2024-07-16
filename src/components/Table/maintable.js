import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, IconButton, Box, Button, Grid} from '@mui/material';
import { Search } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const MainTable = () => {
  const [rows, setRows] = useState([{ id: 1, date: new  Date().toLocaleString(),  columns: Array(14).fill('') }]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (index, columnIndex, value) => {
    const newRows = [...rows];
    newRows[index].columns[columnIndex] = value;
    setRows(newRows);
  };

  const handleSaveSubmit = (index) => {
    // Save and submit logic goes here

    // Add a new empty row
    setRows([...rows, { id: rows.length + 1,date:new Date().toLocaleString(), columns: Array(14).fill('') }]);
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

    <Box sx={{ mt: 2 , mx:3}}>
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
     <Paper sx={{width:'100%', mb:2}}>
     <TableContainer component={Paper} sx={{maxHeight:'calc(90vh - 160px)', }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead sx={{justifyContent:'center'}}>
            <TableRow>
              <TableCell style={{border:'1px', minWidth:'30px', fontWeight:'bold'}}>S.no</TableCell>
              <TableCell style={{border:'1px', minWidth:'160px',fontWeight:'bold'}}>Date</TableCell>
              {Array.from({ length: 14 }).map((_, index) => (
                <TableCell key={index} style={{border:'1px',minWidth:'160px',fontWeight:'bold'}}>Column {index + 3}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, rowIndex) => (
              <TableRow key={row.id}>
                <TableCell style={{border:'1px', height:'40px'}}>{rowIndex + 1}</TableCell>
                <TableCell style={{border:'1px',height:'40px'}}>{row.date}</TableCell>
                {row.columns.map((column, colIndex) => (
                  <TableCell key={colIndex} style={{border:'1px'}}>
                    <TextField
                      variant="outlined"
                      value={column}
                      onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                    />
                  </TableCell>
                ))}
                <TableCell style={{border:'1px'}}>
                 <Grid container spacing={1}>
                  <Grid item>
                  <Button
                    variant='contained'
                    color='primary'
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
     </Paper>
    </Box>
   
  );
};

export default MainTable;
