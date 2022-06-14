import React,
{
  useEffect,
  useState
} from 'react';
import { useDispatch, useSelector } from 'src/store';
import { getAllCurrentLocations } from 'src/slices/currentLocation';

import {
  Card,
  Divider,
  Box,
  Grid,
  Button
} from '@mui/material';

import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
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

const Results = () => {
  const dispatch = useDispatch();

  const allCurrentLocations = useSelector((state) => state.currentLocation.allCurrentLocations);
  const loading = useSelector((state) => state.currentLocation.loading);

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  useEffect(() => {
    dispatch(getAllCurrentLocations());
    handleFilter();
  }, [])

  const [filters, setFilters] = useState({})
  const [filteredCurrentLocations, setFilteredCurrentLocations] = useState(useSelector((state) => state.currentLocation.allCurrentLocations))

  const handleFilter = () => {
    setFilters({
      name,
      registrationNumber, 
      id
    })
  }

  useEffect(() => {
    setFilteredCurrentLocations(
      allCurrentLocations.filter((currentLocation) => {
        if(filters.name &&
          !currentLocation.Name.toLowerCase().includes(filters.name.toLowerCase()) ){
            return false
        }
        if(filters.id && 
          !currentLocation.Id.toString().toLowerCase().includes(filters.id.toLowerCase())){
            return false
        }
        if(filters.registrationNumber &&
          !currentLocation.RegistrationNumber.toLowerCase().includes(filters.registrationNumber.toLowerCase())){
            return false
        }

        return true

        // if (filters.name === "" && filters.id === "" && filters.registrationNumber === "") {
        //   console.log("case 1")
        //   return (currentLocation);
        // }
        // else if (
        //   currentLocation.Name.toLowerCase().includes(filters.name.toLowerCase()) ||
        //   currentLocation.Id.toString().toLowerCase().includes(filters.id.toLowerCase()) ||
        //   currentLocation.RegistrationNumber.toLowerCase().includes(filters.registrationNumber.toLowerCase())
        // ) {
        //   console.log("case 2")
        //   return (currentLocation);
        // }
        // console.log("case 3")
        // return null;
      }
      )
    )
  }, [filters])

  useEffect(()=>{
    if(loading === false){
      setFilteredCurrentLocations(allCurrentLocations)
    }
  }, [loading])

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
          {/* <form> */}
            <Grid
              container
              alignItems="center"
              spacing={3}
            >
              <TextFieldFilter
                label="Id"
                filter={id}
                setFilter={setId}
              />

              <TextFieldFilter
                label="Name"
                filter={name}
                setFilter={setName}
              />

              <TextFieldFilter
                label="Registration Number"
                filter={registrationNumber}
                setFilter={setRegistrationNumber}
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
                  onClick = {() => {handleFilter()}}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          {/* </form> */}
        </Box>

        <Divider />

        <div style={{ width: '100' }}>
          <DataGridWrapper
            rows={filteredCurrentLocations}
            columns={[
              {
                field: 'Id',
                headerName: 'ID',
                flex: 1,
                minWidth: 150
              },
              {
                field: 'Name',
                headerName: 'Name',
                flex: 1,
                minWidth: 150
              },
              {
                field: 'RegistrationNumber',
                headerName: 'Registration Number',
                flex: 1,
                minWidth: 125
              },
              {
                field: 'Address',
                headerName: 'Address',
                flex: 1,
                minWidth: 150,
              },
              {
                field: 'TodayKms',
                headerName: 'Today KMs',
                flex: 1,
                minWidth: 150,
              },
              {
                field: 'GpsTime',
                type: 'dateTime',
                headerName: 'GPS Time',
                flex: 1,
                minWidth: 200,
              },
              {
                field: 'GprsTime',
                type: 'dateTime',
                headerName: 'GPRS Time',
                flex: 1,
                minWidth: 200,
              }
            ]}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 15]}
            loading={loading}
            autoHeight
          />
        </div>
      </Card>
    </>
  );
};

export default Results;
