import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getCities, createCity } from 'src/slices/city';
import { getAllRegions } from 'src/slices/region';
import { getAllStates, groupStates } from 'src/slices/state';
import { searchDistricts } from 'src/slices/district';
import { searchPinCodes } from 'src/slices/pinCode';
import {
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Form from '../blocks/Form';

function Create() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const cityState = useSelector((state) => state.city)

  const [regions, setRegions] = useState([]);
  const [states, setStates] = useState([]);
  const [groupedStates, setGroupedStates] = useState([]);
  const [StateId, setStateId] = useState('');

  useEffect(async () => {
    const resRegions = await getAllRegions();
    const resStates = await getAllStates();

    setRegions(resRegions);
    setGroupedStates(groupStates(resRegions, resStates));
  }, [])


  const [isStateReset, setIsStateReset] = useState(false);
  const handleStates = (value, values, resetForm) => {
    setIsStateReset(!isStateReset);
    if (value) {
      setStates(groupedStates[value.Id])
      resetForm({
        values: {
          Name: values.Name,
          PinCodeIds: values.PinCodeIds,
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
        values : {
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


  // Adding state functionality
  const onAdd = async (values, setSubmitting, setFieldError) => {
    try {
      await createCity(values);
      dispatch(getCities(cityState))

      enqueueSnackbar(('The account was created successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/cities');
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
      anchor='right'
      open
    >
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
                Create City
              </Typography>
            </Grid>

            <Grid item>
              <Link
                to="/cities"
              >
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
              <Form
                city={{}}
                handleSubmit={onAdd}
                buttonLabel="Add City"
                regions={regions}
                states={states}
                handleStates={handleStates}
                handleDistricts={handleDistricts}
                districtLoadOptions={districtLoadOptions}
                pinCodeLoadOptions={pinCodeLoadOptions}
                isStateReset={isStateReset}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default Create
