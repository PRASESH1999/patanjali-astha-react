import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getShs,
  createSh,
} from 'src/slices/sh';
import { getAllStates } from 'src/slices/state';
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
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const shState = useSelector((state) => state.sh);

  const [states, setStates] = useState([]);

  useEffect(async () => {
    const resStates = await getAllStates();
    setStates(resStates);
  }, [])

  const validationSchema = Yup.object().shape({
    EmpCode: Yup.string()
      .required("Employee Code is required."),
    Name: Yup.string()
      .required("Name is required."),
    Email: Yup.string()
      .email("Invalid email."),
    ContactNumber: Yup.string(),
    Username: Yup.string()
      .required("Username is required."),
    Password: Yup.string()
      .required("Password is required."),
    PasswordConfirmation: Yup.string()
      .required("Confirm password is required.")
      .oneOf([Yup.ref('Password')], "The confirmation password does not match"),
    StateIds : Yup.array()
      .required('State is required')
  })

  // Adding sh functionality
  const onAdd = async (values, setSubmitting, setFieldError) => {
    try {
      await createSh(values);
      dispatch(getShs(shState))

      enqueueSnackbar(('Created successfully'), {
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
      anchor='right'
      open
    >
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
                Create SH
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
              <Form
                sh={{}}
                defaultStateValues={[]}
                states={states}
                handleSubmit={onAdd}
                buttonLabel="Add SH"
                validationSchema={validationSchema}
                create
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  )
}


export default Create
