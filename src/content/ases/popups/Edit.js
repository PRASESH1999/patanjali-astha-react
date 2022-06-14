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
  getAseItem,
  updateAse,
  getAses
} from 'src/slices/ase';
import { getAllRegions } from 'src/slices/region';
import { hasRole } from 'src/utils/auth';
import { getAllStates, groupStates } from 'src/slices/state';
import { searchAshs } from 'src/slices/ash';
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

  const aseState = useSelector((state) => state.ase);

  const [regions, setRegions] = useState([]);
  const [states, setStates] = useState([]);
  const [StateId, setStateId] = useState([]);
  const [groupedStates, setGroupedStates] = useState([]);

  const [ase, setAse] = useState({});
  const [isAse, setIsAse] = useState(false);
  const [error, setError] = useState("");

  useEffect(async () => {
    const response = await getAseItem(id);
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
    if(hasRole(['sh', 'ash'])){
      setStates(resStates);
    }
    setAse(response);
    setStateId(response.StateId);
    setIsAse(true);
  }, []);

  useEffect(async () => {
    setStates(groupedStates[ase.RegionId]);
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

  const ashLoadOptions = async (search, loadedOptions, { page }) => {
    console.log("loading")

    let filter = {}
    const response = await searchAshs(page, search, filter);

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
      .oneOf([Yup.ref('Password')], "The confirmation password does not match")
  }

  if (hasRole(["admin", "mis"])) {
    validation.RegionId = Yup.string().required("Region is required.")
  }

  if(hasRole(['admin','mis','sh'])){
    validation.AshId = Yup.string().required("ASH is required");
  }


  const validationSchema = Yup.object().shape(validation);

  const onUpdate = async (values, setSubmitting, setFieldError) => {
    try {
      await updateAse(id, values);
      dispatch(getAses(aseState))

      enqueueSnackbar(('Edited successfully'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });

      navigate('/ases')
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
      {isAse ? (
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
                <Link to="/ases">
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
                      ase={ase}
                      validationSchema = {validationSchema}
                      buttonLabel = "Update ASE"
                      regions = {regions}
                      defaultRegionValue = {{Id: ase.RegionId, Name: ase.RegionName}}
                      states = {states}
                      handleStates = {handleStates}
                      defaultStateValue = { isInitial ? {Id: ase.StateId, Name : ase.StateName} : null}
                      handleDistricts = {handleDistricts}
                      districtLoadOptions = {districtLoadOptions}
                      defaultDistrictValues = {isInitial && (ase.Districts && ase.Districts.map((district) => {
                        return{
                          value : district.Id,
                          label : district.Name
                        }
                      })) }
                      ashLoadOptions = {ashLoadOptions}
                      defaultAshValue = {ase.AshId && {
                        value : ase.AshId,
                        label : `${ase.AshEmpCode} ${ase.AshName}`
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
