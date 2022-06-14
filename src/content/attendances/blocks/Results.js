import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import {
  getAttendances,
  setLimit,
  setPage,
  setSortModel,
  setFilters,
} from 'src/slices/attendance';
import { searchAllUsers } from 'src/slices/allUser';

import {
  Card,
  Divider,
  Button,
  Box,
  TextField,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';

import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { DataGrid } from '@mui/x-data-grid';
// import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import moment from 'moment';
import { DatePicker } from '@mui/lab';
import SelectAsync from 'src/components/SelectAsync';
// import Viewer from 'react-viewer';

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

// const ButtonWrapper = styled(Button)(
//   () => ({
//     padding: 5,
//     minHeight: 0,
//     minWidth: 0,
//   })
// );

const Results = () => {
  const dispatch = useDispatch();

  const attendances = useSelector((state) => state.attendance.attendances);
  const attendanceState = useSelector((state) => state.attendance);
  const page = useSelector((state) => state.attendance.page);
  const limit = useSelector((state) => state.attendance.limit);
  const count = useSelector((state) => state.attendance.count);
  const sortModel = useSelector((state) => state.attendance.sortModel);
  const loading = useSelector((state) => state.attendance.loading);
  const filters = useSelector((state) => state.attendance.filters);
  const defaultUser = useSelector((state) => state.attendance.user);

  
  const convertedDate = (date) =>
    moment(date).format('YYYY-MM-DD');

  const [StartDate, setStartDate] = useState(filters.StartDate || new Date());
  const [EndDate, setEndDate] = useState(filters.EndDate || new Date());
  const [user, setUser] = useState(defaultUser || null);
  // const [visible, setVisible] = useState(false);
  // const [path, setPath] = useState(null);

  useEffect(() => {
    dispatch(getAttendances(attendanceState));
  }, [page, limit, sortModel, filters,])

  const handleFilter = (e) => {
    e.preventDefault();

    let filters = {
      StartDate: convertedDate(StartDate),
      EndDate: convertedDate(EndDate),
    }

    if (user) {
      filters = {
        ...filters,
        UserId: user.value
      }
    }

    dispatch(setFilters(filters, user))
  }

  const loadOptions = async (search, loadedOptions, { page }) => {
    const response = await searchAllUsers(page, search)

    const options = response.Results.map((row) => {
      return {
        value: row.Id,
        label: `${row.EmpCode} ${row.Name}`
      };
    });

    return {
      options,
      hasMore: response.HasMore,
      additional: {
        page: page + 1
      }
    };
  };

  // const handlePunchInPhoto = async (id) => {
  //   const response = await createApiEndpoint(ENDPOINTS.ATTENDANCE).fetchImage(id)
  //   const blob = new Blob([response.data], { type: response.data.type })

  //   setPath(window.URL.createObjectURL(blob));
  //   setVisible(true);

  // }

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
            <Grid p={2} container alignItems="center" spacing={3}>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={2}
              >
                <DatePicker
                  label="Start Date"
                  name="StartDate"
                  inputFormat="yyyy-MM-dd"
                  mask="____-__-__"
                  value={StartDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField size="small" fullWidth {...params} />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={2}
              >
                <DatePicker
                  label="End Date"
                  name="EndDate"
                  inputFormat="yyyy-MM-dd"
                  mask="____-__-__"
                  value={EndDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField size="small" fullWidth {...params} />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={2}
              >
                <SelectAsync
                  placeholder="User"
                  closeMenuOnSelect
                  isClearable
                  value={user}
                  loadOptions={loadOptions}
                  onChange={setUser}
                  additional={{
                    page: 1
                  }}
                />
              </Grid>
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
            rows={attendances}
            page={page}
            disableColumnFilter
            columns={[
              // Table Data
              {
                field: 'UserEmpCode',
                headerName: 'User Code',
                flex: 1,
                minWidth: 125
              },
              {
                field: 'UserName',
                headerName: 'User Name',
                flex: 1,
                minWidth: 150
              },
              {
                field: 'PunchInTime',
                type: 'dateTime',
                headerName: 'Punch In Time',
                flex: 1,
                minWidth: 180
              },
              {
                field: 'PunchOutTime',
                type: 'dateTime',
                headerName: 'Punch Out Time',
                flex: 1,
                minWidth: 180
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

      {/* <Viewer
        noNavbar
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        images={[
          {
            src: path,
          }
        ]}
      /> */}
    </>
  );
};

export default Results;
