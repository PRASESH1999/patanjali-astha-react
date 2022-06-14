import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getRegions,
  createRegion,
} from 'src/slices/region';
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import {
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from 'yup';
import Form from '../blocks/Form';

function Create() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const regionState = useSelector((state) => state.region);

  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .required("Name is required.")
  });

  // Adding Region functionality
  const onAdd = async (values, setSubmitting, setFieldError) => {
    try {
      await createRegion(values);
      dispatch(getRegions(regionState))

      enqueueSnackbar(('Created successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/regions')
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
                Create Region
              </Typography>
            </Grid>

            <Grid item>
              <Link to="/regions">
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
                region={{}}
                validationSchema={validationSchema}
                handleSubmit={onAdd}
                buttonLabel="Add Region"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default Create
