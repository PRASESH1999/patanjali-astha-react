import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getCityItem,
  updateCity,
  getCities
} from 'src/slices/city';
import { getAllRegions } from 'src/slices/region';
import { getAllStates, groupStates } from 'src/slices/state';
import { searchPinCodes } from 'src/slices/pinCode';
import { searchDistricts } from 'src/slices/district';
import {
  Alert,
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import Loader from 'src/components/SuspenseLoader';
import Form from '../blocks/Form';


function Edit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();

  const cityState = useSelector((state) => state.city);

  const [city, setCity] = useState({});
  const [isCity, setIsCity] = useState(false);
  const [error, setError] = useState("");

  const [regions, setRegions] = useState([]);
  const [StateId, setStateId] = useState([])
  const [states, setStates] = useState([]);
  const [groupedStates, setGroupedStates] = useState([]);

  useEffect(async () => {
    const response = await getCityItem(id);
    const resRegions = await getAllRegions();
    const resStates = await getAllStates();
    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    }

    setCity(response);
    setGroupedStates(groupStates(resRegions, resStates));
    setRegions(resRegions);
    setStateId(response.StateId)
    setIsCity(true);
  }, []);

  useEffect(async () => {
    setStates(groupedStates[city.RegionId]);
  },[groupedStates])

  const [isInitial, setIsInitial] = useState(true)

  const handleStates = (value, values, resetForm) => {
    setIsInitial(false)
    if (value) {
      setStates(groupedStates[value.Id])
      resetForm({
        values: {
          ...values,
          RegionId: value.Id,
          StateId: '',
          DistrictId: '',
        }
      })
    } else {
      setStates([])
      resetForm({
        values: {
          ...values,
          RegionId: '',
          StateId: '',
          DistrictId: '',
        }
      })
    }
  }

  const handleDistricts = (value, values, resetForm) => {
    setIsInitial(false)
    if (value) {
      setStateId(value.Id);
      resetForm({
        values: {
          ...values,
          StateId: value.Id,
          DistrictId: ''
        }
      })
    } else {
      setStateId('');
      resetForm({
        values: {
          ...values,
          StateId: '',
          DistrictId: ''
        }
      })
    }
  }

  const districtLoadOptions = async (search, loadedOptions, { page }) => {
    let filter = {};

    if (StateId) {
      filter = { StateId }
    }

    const response = await searchDistricts(page, search, filter)

    const options = response.Results.map((row) => {
      return {
        value: row.Id,
        label: row.Name
      }
    })

    return {
      options,
      hasMore: response.HasMore,
      additional: {
        page: page + 1
      }
    }
  }

  const pinCodeLoadOptions = async (search, loadedOptions, { page }) => {
    let filter = {};

    const response = await searchPinCodes(page, search, filter);

    const options = response.Results.map((row) => {
      return {
        value: row.Id,
        label: row.Name
      }
    })

    return {
      options,
      hasMore: response.HasMore,
      additional: {
        page: page + 1
      }
    }
  };

  const onUpdate = async (values, setSubmitting, setFieldError) => {
    try {
      await updateCity(id, values);
      dispatch(getCities(cityState))

      enqueueSnackbar(('Edited successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/cities')
    } catch (error) {
      setSubmitting(false);
      const response = error.response;

      if (response.status === 400) {
        if (response.data.Name) {
          setFieldError("Name", response.data.Name[0])
        };
      };
    };
  };

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open
    >
      {isCity ? (
        <Grid
          container
          maxWidth={500}

        >
          <Grid item xs={12}>
            <Grid
              container
              justifyContent="space-between"
              p={2}
            >
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  Edit City
                </Typography>
              </Grid>

              <Grid item>
                <Link to="/cities">
                  <IconButton
                    color="error"
                  >
                    <CloseIcon fontSize='medium' />
                  </IconButton>
                </Link>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              p={2}
            >
              <Grid item xs={12}>
                {error ? (
                  <Box width={1}>
                    <Alert variant="filled" severity="error">
                      {error}
                    </Alert>
                  </Box>
                ) : (
                  <Form
                    city={city}
                    handleSubmit={onUpdate}
                    buttonLabel="Update City"
                    regions={regions}
                    defaultRegionValue={{
                      Id: city.RegionId,
                      Name: city.RegionName
                    }}
                    states={states}
                    defaultStateValue={isInitial ? {
                      Id: city.StateId,
                      Name: city.StateName
                    } : null }
                    handleStates = {handleStates}
                    handleDistricts = {handleDistricts}
                    districtLoadOptions={districtLoadOptions}
                    defaultDistrictValue= {isInitial && {
                      value : city.DistrictId,
                      label : city.DistrictName
                    }}
                    pinCodeLoadOptions={pinCodeLoadOptions}
                    defaultPinCodeValues = {city.PinCodes && city.PinCodes.map((pinCode) => {return{
                      value : pinCode.Id,
                      label : pinCode.Name
                    }})}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Loader />
      )}
    </Drawer>
  )
}

export default Edit
