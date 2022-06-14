import React from 'react';
import { useDispatch, useSelector } from 'src/store';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getPinCodes, createPinCode } from 'src/slices/pinCode';
import {
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
  Zoom
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Form from '../blocks/Form';

function Create() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const pinCodeState = useSelector((state) => state.pinCode)

  // Adding state functionality
  const onAdd = async (values, setSubmitting, setFieldError) => {
    try {
      await createPinCode(values);
      dispatch(getPinCodes(pinCodeState))

      enqueueSnackbar(('The account was created successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/pin-codes');
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
                Create Pin Code
              </Typography>
            </Grid>

            <Grid item>
              <Link
                to="/pin-codes"
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
                pinCode={{}}
                handleSubmit={onAdd}
                buttonLabel="Add Pin Code"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default Create
