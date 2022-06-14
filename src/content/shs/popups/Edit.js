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
  getShItem,
  updateSh,
  getShs
} from 'src/slices/sh';
import { getAllStates } from 'src/slices/state';
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

  const shState = useSelector((state) => state.sh);

  const [states, setStates] = useState([]);
  // const [stateValue, setStateValue] = useState(null);
  const [sh, setSh] = useState({});
  const [isSh, setIsSh] = useState(false);
  const [error, setError] = useState("");

  useEffect(async () => {
    const response = await getShItem(id);
    const resStates = await getAllStates();

    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    }
    setSh(response);
    setStates(resStates);
    setIsSh(true);
  }, []);

  const validationSchema = Yup.object().shape({
    StateIds: Yup.array()
      .required(),
    EmpCode: Yup.string()
      .required("Employee Code is required."),
    Name: Yup.string()
      .required("Name is required."),
    ContactNumber: Yup.string(),
    Username: Yup.string()
      .required("Username is required."),
    Email: Yup.string()
      .email("Invalid email."),
    Password: Yup.string(),
    PasswordConfirmation: Yup.string()
      .oneOf([Yup.ref('Password')], "The confirmation password does not match")
  });

  const onUpdate = async (values, setSubmitting, setFieldError) => {
    try {
      await updateSh(id, values);
      dispatch(getShs(shState))

      enqueueSnackbar(('Edited successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/shs')
    } catch (error) {
      setSubmitting(false);

      const response = error.response;

      if (response.status === 400) {
        if (response.data.State) {
          setFieldError("State", response.data.State[0])
        };
        if (response.data.EmpCode) {
          setFieldError("EmpCode", response.data.EmpCode[0])
        };

        if (response.data.Name) {
          setFieldError("Name", response.data.Name[0])
        };

        if (response.data.ContactNumber) {
          setFieldError("ContactNumber", response.data.ContactNumber[0])
        };

        if (response.data.Username) {
          setFieldError("Username", response.data.Username[0])
        };

        if (response.data.Email) {
          setFieldError("Email", response.data.Email[0])
        };

        if (response.data.Password) {
          setFieldError("Password", response.data.Password[0])
        };

        if (response.data.PasswordConfirmation) {
          setFieldError("PasswordConfirmation", response.data.PasswordConfirmation[0])
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
      {isSh ? (
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
                  Edit VP
                </Typography>
              </Grid>

              <Grid item>
                <Link to="/shs">
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
                    sh={sh}
                    states = {states}
                    handleSubmit={onUpdate}
                    buttonLabel="Update SH"
                    validationSchema={validationSchema}
                    defaultStateValues = {sh.States}
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
