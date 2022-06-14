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
  getRegionItem,
  updateRegion,
  getRegions
} from 'src/slices/region';
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import Loader from 'src/components/SuspenseLoader';
import Form from '../blocks/Form';


function Edit() {
  const navigate = useNavigate();

  const { id } = useParams();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const regionState = useSelector((state) => state.region);

  const [region, setRegion] = useState({});
  const [isRegion, setIsRegion] = useState(false);
  const [error, setError] = useState("");

  useEffect(async () => {
    const response = await getRegionItem(id);

    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    }

    setRegion(response);
    setIsRegion(true);
  }, []);

  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .required("Name is required.")
  });

  const onUpdate = async (values, setSubmitting, setFieldError) => {
    try {
      await updateRegion(id, values);
      dispatch(getRegions(regionState))

      enqueueSnackbar(('Edited successfully'), {
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
      anchor="right"
      open
    >
      {isRegion ? (
        <Grid
          container
          maxWidth={800}
          
        >
          <Grid item xs={12}>
            <Grid
              container
              justifyContent="space-between"
              p={2}
            >
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  Edit Region
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
                {error ? (
                  <Box width={1}>
                    <Alert variant="filled" severity="error">
                      {error}
                    </Alert>
                  </Box>
                ) : (
                  <Form
                    region={region}
                    validationSchema={validationSchema}
                    handleSubmit={onUpdate}
                    buttonLabel="Update Region"
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
