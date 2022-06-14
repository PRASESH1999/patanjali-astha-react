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
  getSoItem,
  updateSo,
  getSos
} from 'src/slices/so';
import { getAllRegions } from 'src/slices/region';
import { hasRole } from 'src/utils/auth';
import { getAllStates, groupStates } from 'src/slices/state';
import { searchAses } from 'src/slices/ase';
import { searchDistricts } from 'src/slices/district';
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

  const soState = useSelector((state) => state.so);

  const [regions, setRegions] = useState([]);
  const [states, setStates] = useState([]);
  const [StateId, setStateId] = useState([]);
  const [groupedStates, setGroupedStates] = useState([]);

  const [so, setSo] = useState({});
  const [isSo, setIsSo] = useState(false);
  const [error, setError] = useState("");

  useEffect(async () => {
    const response = await getSoItem(id);
    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    }

    const resStates = await getAllStates();
    const resRegions = await getAllRegions();

    setSo(response);
    setGroupedStates(groupStates(resRegions, resStates));
    setRegions(resRegions);
    setStateId(response.StateId);
    setIsSo(true);
  }, []);

  useEffect(async () => {
    setStates(groupedStates[so.RegionId]);
  }, [groupedStates])

  const [isInitial, setIsInitial] = useState(true);
  const handleStates = (value, values, resetForm) => {
    setIsInitial(false)
    setStates(groupedStates[value ? value.Id : '']);
    resetForm({
      values: {
        ...values,
        RegionId: value.Id || '',
        StateId: '',
        DistrictIds: []
      }
    })
  }

  const handleDistricts = (value, values, resetForm) => {
    setIsInitial(false)
    setStateId(value.Id);
    resetForm({
      values: {
        ...values,
        StateId: value ? value.Id : '',
        DistrictIds: []
      }
    })

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

  const validation = {
    RegionId: Yup.string()
      .required(),
    StateId: Yup.string()
      .required(),
    DistrictIds: Yup.array()
      .min(1),
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
    validation.AseId = Yup.string().required();
  }

  const validationSchema = Yup.object().shape(validation);

  const onUpdate = async (values, setSubmitting, setFieldError) => {
    try {
      await updateSo(id, values);
      dispatch(getSos(soState))

      enqueueSnackbar(('Edited successfully'), {
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

      console.log(error)
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
      {isSo ? (
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
                  Edit ASE
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
                {error ? (
                  <Box width={1}>
                    <Alert variant="filled" severity="error">
                      {error}
                    </Alert>
                  </Box>
                ) : (
                  <>
                    <Form
                      so={so}
                      validationSchema = {validationSchema}
                      buttonLabel = "Update ASE"
                      regions = {regions}
                      defaultRegionValue = {{Id: so.RegionId, Name: so.RegionName}}
                      states = {states}
                      handleStates = {handleStates}
                      defaultStateValue = { isInitial ? {Id: so.StateId, Name : so.StateName} : null}
                      handleDistricts = {handleDistricts}
                      districtLoadOptions = {districtLoadOptions}
                      defaultDistrictValues = {isInitial && (so.Districts && so.Districts.map((district) => {
                        return{
                          value : district.Id,
                          label : district.Name
                        }
                      })) }
                      aseLoadOptions = {aseLoadOptions}
                      defaultAseValue = {so.AseId && {
                        value : so.AseId,
                        label : `${so.AseEmpCode} ${so.AseName}`
                      }}
                      handleSubmit = {onUpdate}
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
