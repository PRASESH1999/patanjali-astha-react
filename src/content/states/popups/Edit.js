import React, { useState, useEffect } from 'react'
import {Link, useNavigate, useParams } from 'react-router-dom'
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
import { getStateItem, getStates, updateState } from 'src/slices/state';
import { useDispatch, useSelector } from 'src/store';
import { getAllRegions } from 'src/slices/region';
import { useSnackbar } from 'notistack';
import Loader from 'src/components/SuspenseLoader';
import Form from '../blocks/Form';

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const stateState = useSelector((state) => state.state)

  const [state, setState] = useState({});
  const [isState, setIsState] = useState(false);
  const [error, setError] = useState("");

  const [regions, setRegions] = useState([]);

  useEffect(async () => {
    const response = await getStateItem(id);
    const resRegions = await getAllRegions();

    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    }
    setRegions(resRegions);
    setState(response);
    setIsState(true);
  }, []);

  const onUpdate = async (values, setSubmitting, setFieldError) => {
    try {
      await updateState(id, values);
      dispatch(getStates(stateState))

      enqueueSnackbar(('The account was edited successfully'), {
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
      anchor="right"
      open

    >
      {isState ? (
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
                  Edit State
                </Typography>
              </Grid>

              <Grid item>
                <Link to="/states">
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
                    state={state}
                    handleSubmit={onUpdate}
                    buttonLabel="Update State"
                    regions={regions}
                    defaultRegionValue = {{
                      Id : state.RegionId,
                      Name : state.RegionName
                    }}
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
