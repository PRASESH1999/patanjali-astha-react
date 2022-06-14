import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import {
  getAdmins,
  deleteAdmin,
  setLimit,
  setPage,
  setSortModel,
  setFilters,
} from 'src/slices/admin';

import {
  Card,
  Divider,
  Button,
  Zoom,
  Box,
  Grid,
  Stack,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

import PreviewIcon from '@mui/icons-material/Preview';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { useSnackbar } from 'notistack';
import DeleteDialog from 'src/components/DeleteDialog';
import TextFieldFilter from 'src/components/TextFieldFilter';

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

  const admins = useSelector((state) => state.admin.admins);
  const adminState = useSelector((state) => state.admin);
  const page = useSelector((state) => state.admin.page);
  const limit = useSelector((state) => state.admin.limit);
  const count = useSelector((state) => state.admin.count);
  const sortModel = useSelector((state) => state.admin.sortModel);
  const loading = useSelector((state) => state.admin.loading);
  const filters = useSelector((state) => state.admin.filters);

  const [Name, setName] = useState(filters.Name || "");
  const [Username, setUsername] = useState(filters.Username || "");

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    dispatch(getAdmins(adminState));
  }, [page, limit, sortModel, filters,])

  const handleConfirmDelete = (id) => {
    setOpenConfirmDelete(true);
    setDeleteId(id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    await deleteAdmin(deleteId);
    dispatch(getAdmins(adminState));

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
      Username
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
              <TextFieldFilter
                label="Name"
                filter={Name}
                setFilter={setName}
              />

              <TextFieldFilter
                label="Username"
                filter={Username}
                setFilter={setUsername}
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
            rows={admins}
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
                field: 'Username',
                headerName: 'Username',
                flex: 1,
                minWidth: 125
              },
              {
                field: 'CreatedAt',
                type: 'dateTime',
                headerName: 'Created At',
                flex: 1,
                minWidth: 200
              },
              {
                field: 'UpdatedAt',
                type: 'dateTime',
                headerName: 'Updated At',
                flex: 1,
                minWidth: 200
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
                      <Link to={`/admins/${params.row.id}`}>
                        <Tooltip title="View" placement="top" arrow>
                          <ButtonWrapper
                            variant='contained'
                            color="info"
                          >
                            <PreviewIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      </Link>

                      <Link to={`/admins/edit/${params.row.id}`} >
                        <Tooltip title="Edit" placement="top" arrow>
                          <ButtonWrapper
                            variant='contained'
                            color="warning"
                          >
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
