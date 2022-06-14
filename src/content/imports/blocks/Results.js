import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import {
  getImports,
  setLimit,
  setPage,
  setSortModel,
  setFilters,
  getTables,
} from 'src/slices/import';

import {
  Card,
  Divider,
  Button,
  Box,
  Grid,
  Stack,
  Tooltip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import PreviewIcon from '@mui/icons-material/Preview';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { DataGrid } from '@mui/x-data-grid';

import TextFieldFilter from 'src/components/TextFieldFilter'
import SelectFilter from 'src/components/SelectFilter'
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import axios from 'axios';
import DownloadingDialog from 'src/components/DownloadingDialog';

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

  const imports = useSelector((state) => state.import.imports);
  const importState = useSelector((state) => state.import);
  const page = useSelector((state) => state.import.page);
  const limit = useSelector((state) => state.import.limit);
  const count = useSelector((state) => state.import.count);
  const sortModel = useSelector((state) => state.import.sortModel);
  const loading = useSelector((state) => state.import.loading);
  const filters = useSelector((state) => state.import.filters);

  const statusOptions = [
    { label: "Success", value: "success" },
    { label: "Running", value: "running" },
    { label: "Error", value: "error" }
  ]

  const [types, setTypes] = useState([]);

  const [Type, setType] = useState("");
  const [Filename, setFilename] = useState("");
  const [Status, setStatus] = useState("");
  const [Remarks, setRemarks] = useState("");
  // const [Tables, setTables] = useState([])

  const CancelToken = axios.CancelToken;
  let isAborted = false;
  // const cancelDownload = useRef(null);

  const [progress, setProgress] = useState(0);
  const [source, setSource] = useState(axios.CancelToken.source)
  const [open, setOpen] = useState(false);

  const handleDownloadOpen = () => {
    setOpen(true);
  }

  const handleDownloadClose = () => {
    setOpen(false);
  }

  useEffect(async () => {
    const response = await getTables();
    setTypes(response);
  }, [])

  useEffect(async () => {
    dispatch(getImports(importState));
  }, [page, limit, sortModel, filters,])

  const handleFilter = (e) => {
    e.preventDefault();

    const filters = {
      Type,
      Filename,
      Status,
      Remarks
    }

    dispatch(setFilters(filters))
  }

  const handleDownload = async (importId) => {
    handleDownloadOpen();

    try {
      const response = await createApiEndpoint(ENDPOINTS.ROUTE).exportRoute(
        importId,
        {
          onDownloadProgress: (progressEvent) => {
            const total = progressEvent.loaded;
            setProgress(total / 1048576);
          },
        },
        source,
      );

      const blob = new Blob([response.data], { type: 'text/csv' });

      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = 'routes.csv';
      a.click();

      handleDownloadClose();
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancel = () => {
    source.cancel('Operation canceled by the user.');
    isAborted = true;

    handleDownloadClose();
  };

  const handleDownloadAgain = () => {
    isAborted = false;
    setSource(CancelToken.source());
  };

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
                sm={6}
                md={4}
                xl={2}
              >
                <FormControl
                  fullWidth
                  size='small'
                >
                  <InputLabel
                    style={{
                      color: '#223354'
                    }}
                    id="type-select-tag"
                  >
                    Type
                  </InputLabel>
                  <Select
                    labelId="type-select-tag"
                    name="Type"
                    label="Type"
                    value={Type}
                    onChange={(e) => {
                      setType(e.target.value);
                    }}
                    variant="outlined"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {types.map((type, key) => (
                      <MenuItem key={key} value={type.Value}>{type.Name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <TextFieldFilter
                label="Filename"
                filter={Filename}
                setFilter={setFilename}
              />

              <SelectFilter
                label="Status"
                filter={Status}
                setFilter={setStatus}
                options={statusOptions}
              />

              <TextFieldFilter
                label="Remarks"
                filter={Remarks}
                setFilter={setRemarks}
              />

              <Grid
                item
                xs={6}
                sm={3}
                md={2}
                xl={1.5}
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
            rows={imports}
            page={page}
            disableColumnFilter
            columns={[
              // Table Data
              {
                field: 'Id',
                headerName: 'Id',
                flex: 1,
                minWidth: 200
              },
              {
                field: 'Type',
                headerName: 'Type',
                flex: 1,
                minWidth: 100
              },
              {
                field: 'Filename',
                headerName: 'Filename',
                flex: 1,
                minWidth: 200
              },
              {
                field: 'Status',
                headerName: 'Status',
                flex: 1,
                minWidth: 80
              },
              {
                field: 'CurrentRow',
                headerName: 'Current Row',
                flex: 1,
                minWidth: 100
              },
              {
                field: 'TotalRows',
                headerName: 'Total Rows',
                flex: 1,
                minWidth: 100
              },
              {
                field: 'Remarks',
                headerName: 'Remarks',
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
                minWidth: 80,
                renderCell: (params) => {
                  return (
                    <Stack direction="row" spacing={1.25}>
                      <Link to={`/imports/${params.row.id}`}>
                        <Tooltip title="View" placement="top" arrow>
                          <ButtonWrapper
                            variant='contained'
                            color="info"
                          >
                            <PreviewIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      </Link>

                      {
                        params.row.Type === 'routes' &&
                        <Tooltip title="View" placement="top" arrow>
                          <ButtonWrapper
                            variant='contained'
                            color="info"
                            onClick={() => {
                              handleDownloadOpen();

                              if (isAborted) {
                                handleDownloadAgain();
                              } else {
                                handleDownload(params.row.id)
                              }
                            }}
                          >
                            <FileDownloadIcon fontSize='small' />
                          </ButtonWrapper>
                        </Tooltip>
                      }

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

      {
        open && (
          <DownloadingDialog 
            open={open}
            progress={progress}
            handleCancel={handleCancel}
          />
        )
      }
    </>
  );
};

export default Results;
