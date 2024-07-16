// client/src/components/Dashboard/UserTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TextField, AppBar,Toolbar,Typography
} from '@mui/material';

const columns = [
  { id: 'sno', label: 'S.No', minWidth: 50 },
  { id: 'date', label: 'Date', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'phone', label: 'Phone Number', minWidth: 170 },
  { id: 'street', label: 'street', minWidth: 170 },
  { id: 'city', label: 'city', minWidth: 170 },
  { id: 'country', label: 'country', minWidth: 170 },
  { id: 'postalcode', label: 'postalcode', minWidth: 170 },
 
];

export default function UserTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const filteredRows = rows.filter(row => {
    return columns.some(column =>
       row[column.id]?.toString().toLowerCase().includes(filter.toLowerCase())
      );
  });

  return (
    <div>
        <AppBar position='fixed'>
          <Toolbar>
      
            <Typography variant='h3' component="div" sx={{flexGrow: 1}}>
              Database
              </Typography>
          <TextField
          label="Filter"
          variant="outlined"
          value={filter}
          onChange={handleFilterChange}
          size='small'
          sx={{marginLeft: 'auto', backgroundColor:'white', borderRadius:5, "& .MuiOutlinedInput-root:hover":{"& fieldset":{border:"none !important"}}}}
        />
         <TablePagination
        rowsPerPageOptions={[100, 150, 200]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        //sx={{position:'sticky', }}
      />
          </Toolbar>
        </AppBar>
        
       
      <Box sx={{mt:'64px',mx:3}}>
      <Paper sx={{ width: '100%', mb:2 }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 160px)' , backgroundColor:'#f5f5f5'}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth , fontWeight:'bold', position:'sticky'}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{row.createdAt}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.streetCity}</TableCell>
                    <TableCell>{row.adminLocality}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{row.postalCode}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
      </Box>
    </div>
 
  );
}
