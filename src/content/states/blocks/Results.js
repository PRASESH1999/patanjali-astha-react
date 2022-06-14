import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import {
  getStates,
  deleteState,
  setLimit,
  setPage,
  setSortModel,
  setFilters,
} from 'src/slices/state';

import {
  Card,
  Divider,
  Button,
  Zoom,
  Box,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import PreviewIcon from '@mui/icons-material/Preview';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { useSnackbar } from 'notistack';
import DeleteDialog from 'src/components/DeleteDialog';
import { DataGrid } from '@mui/x-data-grid';

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
    padding:5,
    minHeight: 0,
    minWidth: 0,
  })
);

const Results = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const states = useSelector((state) => state.state.states);
  const stateState = useSelector((state) => state.state);
  const page = useSelector((state) => state.state.page);
  const limit = useSelector((state) => state.state.limit);
  const count = useSelector((state) => state.state.count);
  const sortModel = useSelector((state) => state.state.sortModel);
  const loading = useSelector((state) => state.state.loading);
  const filters = useSelector((state) => state.state.filters);

  const [Name, setName] = useState(filters.Name || "");
  const [Abbreviation, setAbbreviation] = useState(filters.Abbreviation || "");
  const [Code, setCode] = useState(filters.Code || "");

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    dispatch(getStates(stateState));
  }, [page, limit, sortModel, filters,])

  const handleConfirmDelete = (id) => {
    setOpenConfirmDelete(true);
    setDeleteId(id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    await deleteState(deleteId);
    dispatch(getStates(stateState));

    setOpenConfirmDelete(false);

    enqueueSnackbar(("Deleted Successfully"), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    setDeleteId("");
  };

  const handleFilter = (e) => {
    e.preventDefault();

    const filters = {
      Name,
      Abbreviation,
      Code
    }

    dispatch(setFilters(filters))
  }

  return (
    <>
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
                  InputLabelProps={{
                    style: { color: '#000000' },
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
                  label="Abbreviation"
                  value={Abbreviation}
                  onChange={(e) => setAbbreviation(e.target.value)}
                  InputProps={{
                    endAdornment:
                      Abbreviation &&
                      (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="clear value"
                            onClick={() => {
                              setAbbreviation("")
                            }}
                            edge="end"
                          >
                            <CancelIcon fontSize='small' />
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
                xs={12}
                md={3.5}
                lg={3}
                xl={2}
              >
                <TextField
                  size="small"
                  fullWidth
                  label="Code"
                  value={Code}
                  onChange={(e) => setCode(e.target.value)}
                  InputProps={{
                    endAdornment:
                      Code &&
                      (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setCode("")
                            }}
                            edge="end"
                          >
                            <CancelIcon fontSize='small' />
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
            rows={states}
            page={page}
            disableColumnFilter
            columns={[
              // Table Data
              {
                field: 'Name',
                headerName: 'Name',
                flex: 1,
                minWidth: 200
              },
              {
                field: 'RegionName',
                headerName: 'Region',
                flex: 1,
                minWidth: 60
              },
              {
                field: 'Abbreviation',
                headerName: 'Abbreviation',
                flex: 1,
                minWidth: 100
              },
              {
                field: 'Code',
                headerName: 'Code',
                flex: 1,
                minWidth: 60
              },
              {
                field: 'CreatedAt',
                type: 'dateTime',
                headerName: 'Created At',
                flex: 1,
                minWidth: 180
              },
              {
                field: 'UpdatedAt',
                type: 'dateTime',
                headerName: 'Updated At',
                flex: 1,
                minWidth: 180
              },
              {
                field: 'actions',
                headerName: 'Actions',
                sortable: false,
                flex: 1,
                minWidth: 200,
                renderCell: (params) => {
                  return (
                    <Stack direction="row" spacing={1.25}>
                      <Link to={`/states/${params.row.id}`}>
                        <Tooltip title="View" placement="top" arrow>
                          <ButtonWrapper 
                            variant='contained'
                            color="info"
                          >
                            <PreviewIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      </Link>

                      <Link to={`/states/edit/${params.row.id}`}>
                        <Tooltip title="Edit" placement="top" arrow>
                          <ButtonWrapper 
                            variant='contained'
                            color="warning">
                            <EditIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      </Link>

                      <Tooltip title="Delete" placement="top" arrow>
                        <ButtonWrapper
                        variant='contained'
                          color="error"
                          onClick={() => handleConfirmDelete(params.row.id)}
                        >
                          <DeleteForeverIcon fontSize='small' />
                        </ButtonWrapper>
                      </Tooltip>
                    </Stack>
                  );
                }
              }
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

      <DeleteDialog
        handleDeleteCompleted={handleDeleteCompleted}
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
      />
    </>
  );
};

export default Results;
