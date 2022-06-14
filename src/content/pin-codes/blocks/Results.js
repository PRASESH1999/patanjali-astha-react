import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import {
  getPinCodes,
  deletePinCode,
  setLimit,
  setPage,
  setSortModel,
  setFilters
} from 'src/slices/pinCode';

import {
  Card,
  Divider,
  Button,
  Zoom,
  Box,
  Grid,
  Tooltip,
  Stack,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

import PreviewIcon from '@mui/icons-material/Preview';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { useSnackbar } from 'notistack';
import DeleteDialog from 'src/components/DeleteDialog';
import { hasRole } from 'src/utils/auth';
import CancelIcon from '@mui/icons-material/Cancel';

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

const ButtonWrapper = styled(Button)(
  () => ({
    padding: 5,
    minHeight: 0,
    minWidth: 0,
  })
);

const Results = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const pinCodes = useSelector((state) => state.pinCode.pinCodes);
  const pinCodeState = useSelector((state) => state.pinCode);
  const page = useSelector((state) => state.pinCode.page);
  const limit = useSelector((state) => state.pinCode.limit);
  const count = useSelector((state) => state.pinCode.count);
  const sortModel = useSelector((state) => state.pinCode.sortModel);
  const loading = useSelector((state) => state.pinCode.loading);
  const filters = useSelector((state) => state.pinCode.filters);

  // Filter
  const [Name, setName] = useState(filters.Name || '');

  const handleFilter = (e) => {
    e.preventDefault();

    const filters = {
      Name,
    };

    dispatch(setFilters(filters));
  };

  // Delete
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  // Fetching SHs to Display
  useEffect(() => {
    dispatch(getPinCodes(pinCodeState));
  }, [page, limit, sortModel, filters]);

  // Delete PopUps and Functions
  const handleConfirmDelete = (id) => {
    setOpenConfirmDelete(true);
    setDeleteId(id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    await deletePinCode(deleteId);
    dispatch(getPinCodes(pinCodeState));

    setOpenConfirmDelete(false);

    enqueueSnackbar('Deleted Successfully', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    setDeleteId('');
  };

  return (
    <>
      <Card
        sx={{
          mx: 2
        }}
      >
        {/* Filter Form */}
        <Box p={2}>
          <form onSubmit={handleFilter}>
            <Grid container alignItems="center" spacing={3}>
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
                    endAdornment: Name && (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setName('');
                          }}
                          edge="end"
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  InputLabelProps={{
                    style: { color: '#000000' },
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
            rows={pinCodes}
            page={page}
            disableColumnFilter
            columns={[
              // Table Data
              {
                field: 'Name',
                headerName: 'Name',
                flex: 1,
                minWidth: 150
              },
              {
                field: 'CreatedAt',
                type: 'dateTime',
                headerName: 'Created At',
                flex: 1,
                minWidth: 160
              },
              {
                field: 'UpdatedAt',
                type: 'dateTime',
                headerName: 'Updated At',
                flex: 1,
                minWidth: 160
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                flex: 1,
                minWidth: 220,
                renderCell: (params) => {
                  return (
                    <Stack direction="row" spacing={1.25}>
                      <Link to={`/pin-codes/${params.row.id}`}>
                        <Tooltip title="View" placement="top" arrow>
                          <ButtonWrapper
                            variant="contained"
                            color="info"
                          >
                            <PreviewIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      </Link>

                      <Link to={`/pin-codes/edit/${params.row.id}`}>
                        <Tooltip title="Edit" placement="top" arrow>
                          <ButtonWrapper
                            variant="contained"
                            color="warning"
                          >
                            <EditIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      </Link>

                      {hasRole(['admin']) && (
                        <Tooltip title="Delete" placement="top" arrow>
                          <ButtonWrapper
                            variant="contained"
                            color="error"
                            onClick={() => handleConfirmDelete(params.row.id)}
                          >
                            <DeleteForeverIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      )}
                    </Stack>
                  );
                }
              }
            ]}
            sortingMode="server"
            sortingOrder={['asc', 'desc', null]}
            sortModel={sortModel}
            onSortModelChange={(newModel) => {
              dispatch(setSortModel(newModel));
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

      <DeleteDialog
        handleDeleteCompleted={handleDeleteCompleted}
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
      />
    </>
  );
};

export default Results;
