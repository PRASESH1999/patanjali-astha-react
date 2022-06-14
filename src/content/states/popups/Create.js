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
import { createState, getStates } from 'src/slices/state';
import Form from '../blocks/Form';

function Create() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const stateState = useSelector((state) => state.state)
  const [regions, setRegions] = useState([])

  useEffect(async () => {
    const resRegions = await getAllRegions();

    setRegions(resRegions);
  }, [])

  // Adding state functionality
  const onAdd = async (values, setSubmitting, setFieldError) => {
    try {
      await createState(values);
      dispatch(getStates(stateState))

      enqueueSnackbar(('The account was created successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/states');
    } catch (error) {
      setSubmitting(false);

      const response = error.response;

      if (response.status === 400) {
        if (response.data.Name) {
          setFieldError("Name", response.data.Name[0])
        };
      };

      if (response.status === 400) {
        if (response.data.Abbreviation) {
          setFieldError("Abbreviation", response.data.Abbreviation[0])
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
                Create State
              </Typography>
            </Grid>

            <Grid item>
              <Link
                to="/states"
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
                state={{}}
                handleSubmit={onAdd}
                buttonLabel="Add State"
                regions = {regions}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default Create
