import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import {
  getAllUsers,
  setLimit,
  setPage,
  setSortModel,
  setFilters,
} from 'src/slices/allUser';

import {
  Card,
  Divider,
  Button,
  Box,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import CancelIcon from '@mui/icons-material/Cancel';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PageHeader from './PageHeader';

const DataGridWrapper = styled(DataGrid)(
  () => ({
    borderRadius: '0px',
    borderRight: '0px',
    borderLeft: '0px',

    '& .MuiDataGrid-columnHeader': {
      backgroundColor: 'rgba(128,128,128,0.1)',
      padding: 4,
    },
  }));

const Results = () => {
  const dispatch = useDispatch();

  const allUsers = useSelector((state) => state.allUser.allUsers);
  const allUserState = useSelector((state) => state.allUser);
  const page = useSelector((state) => state.allUser.page);
  const limit = useSelector((state) => state.allUser.limit);
  const count = useSelector((state) => state.allUser.count);
  const sortModel = useSelector((state) => state.allUser.sortModel);
  const loading = useSelector((state) => state.allUser.loading);
  const filters = useSelector((state) => state.allUser.filters);

  const [Name, setName] = useState(filters.Name || "");
  const [EmpCode, setEmpCode] = useState(filters.EmpCode || "");

  useEffect(() => {
    dispatch(setFilters({PunchedInOnly: true}));
  }, []);

  useEffect(() => {
    dispatch(getAllUsers(allUserState));
  }, [page, limit, sortModel, filters,])

  const handleFilter = (e) => {
    e.preventDefault();

    const filters = {
      Name,
      EmpCode,
      PunchedInOnly: true
    }

    dispatch(setFilters(filters))
  }

  return (
    <>
      <Helmet>
        <title>Punched In Users</title>
      </Helmet>

      {/* Page header: Contains page heading and button to navigate to create page */}
      <PageHeader
        title="Punched In Users"
      />

      <Card
        sx={{
          mx: 2
        }}
      >
        <Box
          p={2}
        >
          <form onSubmit={handleFilter}>
            <Grid
              container
              alignItems="center"
              spacing={3}
            >
              <Grid
                item
                xs={12}
                md={3.5}
                lg={3}
                xl={2}
              >
                <TextField
                  size="small"
                  fullWidth
                  label="Name"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    endAdornment:
                      Name &&
                      (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setName("")
                            }}
                            edge="end"
                          >
                            <CancelIcon fontSize='small' />
                          </IconButton>
                        </InputAdornment>
                      )
                  }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={3.5}
                lg={3}
                xl={2}
              >
                <TextField
                  size="small"
                  fullWidth
                  label="Emp Code"
                  value={EmpCode}
                  onChange={(e) => setEmpCode(e.target.value)}
                  InputProps={{
                    endAdornment:
                      EmpCode &&
                      (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setEmpCode("")
                            }}
                            edge="end"
                          >
                            <CancelIcon fontSize='small' />
                          </IconButton>
                        </InputAdornment>
                      )
                  }}
                />
              </Grid>

              <Grid
                item
                xs={4}
                md={2}
                lg={1.6}
                xl={1.2}
              >
                <Button
                  size="small"
                  fullWidth
                  startIcon={<FilterAltIcon />}
                  variant="contained"
                  type="submit"
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          </form>


        </Box>
        <Divider />

        {/* List Data Table /Data Grid */}
        <div style={{ width: '100' }}>
          <DataGridWrapper
            rows={allUsers}
            page={page}
            disableColumnFilter
            columns={[
              // Table Data
              {
                field: 'EmpCode',
                headerName: 'Emp Code',
                flex: 1,
                minWidth: 150
              },
              {
                field: 'Role',
                headerName: 'Role',
                flex: 1,
                minWidth: 150,
                renderCell: (params) => (
                  params.row.Role.toUpperCase()
                )
              },
              {
                field: 'Name',
                headerName: 'Name',
                flex: 1,
                minWidth: 150
              },
            ]}
            sortingMode="server"
            sortingOrder={['asc', 'desc', null]}
            sortModel={sortModel}
            onSortModelChange={(newModel) => {
              dispatch(setSortModel(newModel))
              dispatch(setPage(0));
            }}

            pagination
            pageSize={limit}
            rowsPerPageOptions={[5, 10, 15]}
            rowCount={count}
            paginationMode="server"
            onPageChange={(newPage) => dispatch(setPage(newPage))}
            onPageSizeChange={(newPageSize) => dispatch(setLimit(newPageSize))}
            loading={loading}
            autoHeight
          />
        </div>
      </Card>
    </>
  );
};

export default Results;
