import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAsh, getAshs } from 'src/slices/ash';
import {
  searchShs,
} from 'src/slices/sh';
import { getAllRegions } from 'src/slices/region';
import { getAllStates, groupStates } from 'src/slices/state';
import { useDispatch, useSelector } from 'src/store';
import { useSnackbar } from 'notistack';
import { hasRole } from 'src/utils/auth';
import * as Yup from 'yup';
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
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const ashState = useSelector((state) => state.ash);

  const [regions, setRegions] = useState([]);
  const [states, setStates] = useState([]);
  const [groupedStates, setGroupedStates] = useState([]);

  useEffect(async () => {
    if(hasRole(['admin', 'mis'])){
      const resRegions = await getAllRegions();
      setRegions(resRegions);
      setGroupedStates(groupStates(resRegions, resStates));
    }
    const resStates = await getAllStates();

    if(hasRole(['sh'])){
      setStates(resStates)
    }
  }, []);

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
    Password: Yup.string()
      .required("Password is required."),
    PasswordConfirmation: Yup.string()
      .required("Confirm password is required.")
      .oneOf([Yup.ref('Password')], "The confirmation password does not match")
  }

  if (hasRole(["admin", "mis"])) {
    validation.ShId = Yup.string()
      .required("Sh is required.");
    validation.RegionId = Yup.string()
      .required("Region is required");
  }

  const validationSchema = Yup.object().shape(validation);


  const [isReset, setIsReset] = useState(false);
  const handleStates = (value, values, resetForm) => {
    setIsReset(!isReset)

    if (value) {
      setStates(groupedStates[value.Id]);
      resetForm({
        values: {
          Name: values.Name,
          EmpCode: values.EmpCode,
          Email: values.Email,
          ContactNumber: values.ContactNumber,
          Username: values.Username,
          Password: values.Password,
          PasswordConfirmation: values.PasswordConfirmation,
          RegionId: value?.Id || '',
          StateIds: []
        }
      })
    } else {
      setStates([]);
      resetForm({
        values: {
          Name: values.Name,
          EmpCode: values.EmpCode,
          Email: values.Email,
          ContactNumber: values.ContactNumber,
          Username: values.Username,
          Password: values.Password,
          PasswordConfirmation: values.PasswordConfirmation,
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


  // Adding ash functionality
  const onAdd = async (values, setSubmitting, setFieldError) => {
    try {
      await createAsh(values);
      dispatch(getAshs(ashState))

      enqueueSnackbar(('Created successfully'), {
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
        if (response.data.Region) {
          setFieldError("Region", response.data.Region[0])
        }
        if (response.data.State) {
          setFieldError("State", response.data.State[0])
        };
        if (response.data.ShId) {
          setFieldError("ShId", response.data.ShId[0])
        }
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
                Create ASH
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
              <Form
                ash={{}}
                regions={regions}
                handleStates={handleStates}
                loadOptions={loadOptions}
                defaultStateValues={[]}
                states={states}
                handleSubmit={onAdd}
                buttonLabel="Add ASH"
                validationSchema={validationSchema}
                isReset={isReset}
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
