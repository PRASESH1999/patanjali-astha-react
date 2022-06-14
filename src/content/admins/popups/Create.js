import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAdmins,
  createAdmin,
} from 'src/slices/admin';
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

  const adminState = useSelector((state) => state.admin);

  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .required("Name is required."),
    Username: Yup.string()
      .required("Username is required."),
    Email: Yup.string()
      .email("Invalid email"),
    Password: Yup.string()
      .required("Password is required."),
    PasswordConfirmation: Yup.string()
      .required("Confirm Password is required.")
      .oneOf([Yup.ref('Password')], "The confirmation password does not match")
  });

  // Adding admin functionality
  const onAdd = async (values, setSubmitting, setFieldError) => {
    try {
      await createAdmin(values);
      dispatch(getAdmins(adminState))

      enqueueSnackbar(('Created successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/admins')
    } catch (error) {
      setSubmitting(false);

      const response = error.response;

      if (response.status === 400) {
        if (response.data.Name) {
          setFieldError("Name", response.data.Name[0])
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
                Create Admin
              </Typography>
            </Grid>

            <Grid item>
              <Link to="/admins">
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
                admin={{}}
                handleSubmit={onAdd}
                buttonLabel="Add Admin"
                validationSchema={validationSchema}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default Create