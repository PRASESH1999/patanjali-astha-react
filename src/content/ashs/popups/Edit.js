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
  getAshItem,
  updateAsh,
  getAshs
} from 'src/slices/ash';
import { getAllRegions } from 'src/slices/region';
import { searchShs } from 'src/slices/sh';
import { hasRole } from 'src/utils/auth';
import { getAllStates, groupStates } from 'src/slices/state';
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

  const ashState = useSelector((state) => state.ash);

  const [regions, setRegions] = useState([]);
  const [states, setStates] = useState([]);
  const [groupedStates, setGroupedStates] = useState([]);

  const [ash, setAsh] = useState({});
  const [isAsh, setIsAsh] = useState(false);
  const [error, setError] = useState("");

  useEffect(async () => {
    const response = await getAshItem(id);
    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    }
    const resStates = await getAllStates();

    if(hasRole(['admin', 'mis'])){
      const resRegions = await getAllRegions();
      setRegions(resRegions);
      setGroupedStates(groupStates(resRegions, resStates));
    }
    if(hasRole('sh')){
      setStates(resStates)
    }

    setAsh(response);
    setIsAsh(true);
  }, []);

  useEffect(async () => {
    setStates(groupedStates[ash.RegionId]);
  }, [groupedStates])

  const [isInitial, setIsInitial] = useState(true);
  const handleStates = (value, values, resetForm) => {
    setIsInitial(false)
    if (value) {
      setStates(groupedStates[value?.Id]);
      resetForm({
        values: {
          ...values,
          RegionId: value.Id,
          StateIds: []
        }
      })
    } else {
      setStates([]);
      resetForm({
        values: {
          ...values,
          RegionId: '',
          StateIds: []
        }
      })
    }
  }

  const loadOptions = async (search, loadedOptions, { page }) => {
    let filter = {}

    const response = await searchShs(page, search, filter);

    const options = response.Results.map((row) => {
      return {
        value: row.Id,
        label: `${row.EmpCode} ${row.Name}`
      }
    })

    return {
      options,
      hasMore: response.HasMore,
      additional: {
        page: page + 1
      }
    }
  }

  const validation = {
    StateIds: Yup.array()
      .min(1, "States are required."),
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
  }

  if (hasRole(["admin", "mis"])) {
    validation.ShId = Yup.string()
      .required("Sh is required.");
    validation.RegionId = Yup.string()
      .required("Region is required");
  }

  const validationSchema = Yup.object().shape(validation);

  const onUpdate = async (values, setSubmitting, setFieldError) => {
    try {
      await updateAsh(id, values);
      dispatch(getAshs(ashState))

      enqueueSnackbar(('Edited successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/ashs')
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
      {isAsh ? (
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
                  Edit ASH
                </Typography>
              </Grid>

              <Grid item>
                <Link to="/ashs">
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
                  <>
                    <Form
                      ash={ash}
                      regions={regions}
                      handleStates={handleStates}
                      loadOptions={loadOptions}
                      defaultShValue={{
                        value: ash.ShId,
                        label: `${ash.ShEmpCode} ${ash.ShName}`
                      }}
                      defaultStateValues={isInitial ? ash.States : []}
                      defaultRegionValue={{ Id: ash.RegionId, Name: ash.RegionName }}
                      states={states}
                      handleSubmit={onUpdate}
                      buttonLabel="Update ASH"
                      validationSchema={validationSchema}
                    />
                  </>
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
