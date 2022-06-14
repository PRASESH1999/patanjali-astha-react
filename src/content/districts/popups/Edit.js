import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import {
  getDistrictItem,
  updateDistrict,
  getDistricts
} from 'src/slices/district';
import { getAllRegions } from 'src/slices/region';
import { getAllStates, groupStates } from 'src/slices/state';
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import Loader from 'src/components/SuspenseLoader';
import Form from '../blocks/Form';


function Edit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();

  const districtState = useSelector((state) => state.district);

  const [district, setDistrict] = useState({});
  const [isDistrict, setIsDistrict] = useState(false);
  const [error, setError] = useState("");

  const [regions, setRegions] = useState([]);
  const [states, setStates] = useState([]);
  const [groupedStates, setGroupedStates] = useState([]);

  useEffect(async () => {
    const response = await getDistrictItem(id);
    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    }

    const resRegions = await getAllRegions();
    const resStates = await getAllStates();
    
    setDistrict(response);
    setGroupedStates(groupStates(resRegions, resStates))
    setRegions(resRegions);
    setIsDistrict(true);

  }, []);

  useEffect(async () => {
    setStates(groupedStates[district.RegionId]);
  }, [groupedStates])

  const [isReset, setIsReset] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  const handleStates = (value, values, resetForm) => {
    setIsReset(!isReset)
    setIsInitial(false)
    if(value) {
      setStates(groupedStates[value.Id]);
      resetForm({
        values : {
          Name: values.Name,
          Code: values.Code,
          RegionId: value.Id,
          StateId: ''
        }
      })
    } else {
      setStates([]);
      resetForm({
        values : {
          Name: values.Name,
          Code: values.Code,
          RegionId: '',
          StateId: ''
        }
      })}
  }

  const onUpdate = async (values, setSubmitting, setFieldError) => {
    try {
      await updateDistrict(id, values);
      dispatch(getDistricts(districtState))

      enqueueSnackbar(('Edited successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/districts')
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
      {isDistrict ? (
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
                  Edit District
                </Typography>
              </Grid>

              <Grid item>
                <Link to="/districts">
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
                    district={district}
                    handleSubmit={onUpdate}
                    buttonLabel="Update District"
                    regions = {regions}
                    defaultRegionValue = {{Id : district.RegionId, Name : district.RegionName}}
                    states = {states}
                    defaultStateValue = {isInitial ? {Id : district.StateId, Name : district.StateName} : null}
                    handleStates = {handleStates}
                    isReset = {isReset}
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
