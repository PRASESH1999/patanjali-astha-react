import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import {
  getAshs,
  deleteAsh,
  setLimit,
  setPage,
  setSortModel,
  setFilters,
  markInactive,
  markActive
} from 'src/slices/ash';

import {
  Card,
  Divider,
  Button,
  Zoom,
  Box,
  Grid,
  Tooltip,
  Stack
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

import PreviewIcon from '@mui/icons-material/Preview';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/CloseTwoTone';

import { useSnackbar } from 'notistack';
import DeleteDialog from 'src/components/DeleteDialog';
import { hasRole } from 'src/utils/auth';
import UserFilter from 'src/components/UserFilter';
import SelectStatus from 'src/components/SelectStatus';

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

  // State
  const ashs = useSelector((state) => state.ash.ashs);
  const ashState = useSelector((state) => state.ash);
  const page = useSelector((state) => state.ash.page);
  const limit = useSelector((state) => state.ash.limit);
  const count = useSelector((state) => state.ash.count);
  const sortModel = useSelector((state) => state.ash.sortModel);
  const loading = useSelector((state) => state.ash.loading);
  const filters = useSelector((state) => state.ash.filters);

  // Filter
  const [EmpCode, setEmpCode] = useState(filters.EmpCode || '');
  const [Name, setName] = useState(filters.Name || '');
  const [Username, setUsername] = useState(filters.Username || '');
  const [Status, setStatus] = useState(filters.Status || '');

  const handleFilter = (e) => {
    e.preventDefault();

    const filters = {
      EmpCode,
      Name,
      Username,
      Status
    };

    dispatch(setFilters(filters));
  };

  // Delete
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  // Fetching SHs to Display
  useEffect(() => {
    dispatch(getAshs(ashState));
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
    await deleteAsh(deleteId);
    dispatch(getAshs(ashState));

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
              <UserFilter
                EmpCode={EmpCode}
                setEmpCode={setEmpCode}
                Name={Name}
                setName={setName}
                Username={Username}
                setUsername={setUsername}
              />

              <SelectStatus
                Status={Status}
                setStatus={setStatus}
              />

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
            rows={ashs}
            page={page}
            disableColumnFilter
            columns={[
              // Table Data
              {
                field: 'EmpCode',
                headerName: 'Emp Code',
                flex: 1,
                minWidth: 100
              },
              {
                field: 'Name',
                headerName: 'Name',
                flex: 1,
                minWidth: 150
              },
              {
                field: 'Username',
                headerName: 'Username',
                flex: 1,
                minWidth: 120
              },
              {
                field: "IsActive",
                headerName: "Is Active",
                align: "center",
                flex: 1,
                minWidth: 90,
                renderCell: (params) => {
                  if (params.row.IsActive) {
                    return (
                        <CheckIcon />
                    )
                  }
                  return (
                      <CloseIcon />
                  )
                }
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
                      <Link to={`/ashs/${params.row.id}`}>
                        <Tooltip title="View" placement="top" arrow>
                          <ButtonWrapper
                            variant="contained" 
                            color="info"
                          >
                            <PreviewIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      </Link>

                      <Link to={`/ashs/edit/${params.row.id}`}>
                        <Tooltip title="Edit" placement="top" arrow>
                          <ButtonWrapper
                            variant="contained" 
                            color="warning"
                          >
                            <EditIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      </Link>

                      {params.row.IsActive ? (
                        <Tooltip title="Mark as Inactive" placement="top" arrow>
                          <ButtonWrapper
                            variant="contained"
                            color="error"
                            onClick={async () => {
                              await markInactive(params.row.id);
                              dispatch(getAshs(ashState));
                            }}
                          >
                            <CloseIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Mark as Active" placement="top" arrow>
                          <ButtonWrapper
                            variant="contained"
                            color="success"
                            onClick={async () => {
                              await markActive(params.row.id)
                              dispatch(getAshs(ashState));
                            }}
                          >
                            <CheckIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      )}

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
