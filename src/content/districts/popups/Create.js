import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getAllRegions } from 'src/slices/region';
import {
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getDistricts, createDistrict } from 'src/slices/district';
import { getAllStates, groupStates } from 'src/slices/state';
import Form from '../blocks/Form';

function Create() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const districtState = useSelector((state) => state.district)

  const [regions, setRegions] = useState([])
  const [states, setStates] = useState([])
  const [groupedStates, setGroupedStates] = useState([]);

  useEffect(async () => {
    const resRegions = await getAllRegions();
    const resStates = await getAllStates();

    setRegions(resRegions);
    setGroupedStates(groupStates(resRegions, resStates))
  }, [])

  const [isReset, setIsReset] = useState(false);
  const handleStates = (value, values, resetForm) => {
    setIsReset(!isReset);
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

  // Adding state functionality
  const onAdd = async (values, setSubmitting, setFieldError) => {
    try {
      await createDistrict(values);
      dispatch(getDistricts(districtState))

      enqueueSnackbar(('The account was created successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/districts');
    } catch (error) {
      setSubmitting(false);

      const response = error.response;

      if (response.status === 400) {
        if (response.data.Name) {
          setFieldError("Name", response.data.Name[0])
        };
      };

      if (response.status === 400) {
        if (response.data.Code) {
          setFieldError("Code", response.data.Code[0])
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
                Create District
              </Typography>
            </Grid>

            <Grid item>
              <Link
                to="/districts"
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
                district={{}}
                handleSubmit={onAdd}
                buttonLabel="Add District"
                regions = {regions}
                states = {states}
                handleStates = {handleStates}
                isReset = {isReset}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default Create
