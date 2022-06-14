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
import { getAdminItem, updateAdmin, getAdmins } from 'src/slices/admin';
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import Loader from 'src/components/SuspenseLoader';
import Form from '../blocks/Form';


function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const adminState = useSelector((state) => state.admin);

  const [admin, setAdmin] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  useEffect(async () => {
    const response = await getAdminItem(id);

    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    }

    setAdmin(response);
    setIsAdmin(true);
  }, [id]);

  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .required("Name is required."),
    Username: Yup.string()
      .required("Username is required."),
    Email: Yup.string()
      .email("Invalid email"),
    Password: Yup.string(),
    PasswordConfirmation: Yup.string()
      .oneOf([Yup.ref('Password')], "The confirmation password does not match")
  });

  const onUpdate = async (values, setSubmitting, setFieldError) => {
    try {
      await updateAdmin(id, values);
      dispatch(getAdmins(adminState))

      enqueueSnackbar(('Edited successfully'), {
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
      {isAdmin ? (
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
                  Edit Admin
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
                {error ? (
                  <Box width={1}>
                    <Alert variant="filled" severity="error">
                      {error}
                    </Alert>
                  </Box>
                ) : (
                  <Form
                    admin={admin}
                    handleSubmit={onUpdate}
                    buttonLabel="Update Admin"
                    validationSchema={validationSchema}
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
