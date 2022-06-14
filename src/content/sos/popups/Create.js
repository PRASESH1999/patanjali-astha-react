import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createSo, getSos } from 'src/slices/so';
import { searchAses} from 'src/slices/ase';
import { getAllRegions } from 'src/slices/region';
import { getAllStates, groupStates } from 'src/slices/state';
import { searchDistricts } from 'src/slices/district';
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

  const soState = useSelector((state) => state.so);

  const [regions, setRegions] = useState([]);
  const [StateId, setStateId] = useState([]);
  const [states, setStates] = useState([]);
  const [groupedStates, setGroupedStates] = useState([]);

  useEffect(async () => {
    const resStates = await getAllStates();
    const resRegions = await getAllRegions();

    setRegions(resRegions);
    setGroupedStates(groupStates(resRegions, resStates));
  }, []);

  const validation = {
    RegionId: Yup.string()
      .required("Region is required"),
    StateId: Yup.string()
      .required("State is required."),
    DistrictIdsL: Yup.array()
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
    validation.AseId = Yup.string().required();
  }

  const validationSchema = Yup.object().shape(validation);

  const handleStates = (value, values, resetForm) => {
    if (value) {
      setStates(groupedStates[value.Id]);
      resetForm({
        values: {
          ...values,
          RegionId: value?.Id || '',
          StateId: '',
          DistrictIds: []
        }
      })
    } else {
      setStates([]);
      resetForm({
        values: {
          ...values,
          RegionId: '',
          StateId: '',
          DistrictIds: []
        }
      })
    }
  }

  const handleDistricts = (value, values, resetForm) => {
    if (value) {
      setStateId(value.Id);
      resetForm({
        values: {
          ...values,
          StateId: value.Id,
          DistrictIds: []
        }
      })
    } else {
      setStateId('');
      resetForm({
        valies: {
          ...values,
          StateId: '',
          DistrictIds: []
        }
      })
    }
  }

  const districtLoadOptions = async (search, loadedOptions, { page }) => {
    let filter = {}
    if (StateId) {
      filter = { StateId }
    }
    const response = await searchDistricts(page, search, filter);

    const options = response.Results.map((row) => {
      return {
        value: row.Id,
        label: row.Name
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

  const aseLoadOptions = async (search, loadedOptions, { page }) => {

    let filter = {}
    const response = await searchAses(page, search, filter);

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


  // Adding so functionality
  const onAdd = async (values, setSubmitting, setFieldError) => {
    try {
      await createSo(values);
      dispatch(getSos(soState))

      enqueueSnackbar(('Created successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/sos')
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
        if (response.data.AseId) {
          setFieldError("AseId", response.data.AseId[0])
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
                Create SO
              </Typography>
            </Grid>

            <Grid item>
              <Link to="/sos">
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
                so={{}}
                validationSchema={validationSchema}
                regions={regions}
                states={states}
                handleStates={handleStates}
                handleDistricts={handleDistricts}
                districtLoadOptions={districtLoadOptions}
                aseLoadOptions={aseLoadOptions}
                handleSubmit={onAdd}
                buttonLabel ="Add SO"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  )
}


export default Create
