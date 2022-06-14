import React from 'react'
import { Link } from 'react-router-dom';
import {
  Grid,
  Button,
  CircularProgress,
  Divider,
  Box,
  Autocomplete,
  TextField,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormikControl from 'src/components/Formik/FormikControl';

const Form = (props) => {
  const {
    city,
    handleSubmit,
    buttonLabel,
    regions,
    defaultRegionValue,
    states,
    defaultStateValue,
    handleStates,
    handleDistricts,
    districtLoadOptions,
    defaultDistrictValue,
    pinCodeLoadOptions,
    defaultPinCodeValues,
  } = props;

  const validationSchema = Yup.object().shape({
    RegionId: Yup.string().required(),
    StateId: Yup.string().required(),
    DistrictId: Yup.string().required(),
    PinCodeIds : Yup.array().min(1).required(),
    Name: Yup.string()
      .required(),
  });

  const initialValues = {
    RegionId: city.RegionId || "",
    StateId: city.StateId || "",
    DistrictId: city.DistrictId || "",
    PinCodeIds: city.PinCodes?.map((pinCode) => pinCode.Id) || [],
    Name: city.Name || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        await handleSubmit(values, setSubmitting, setFieldError);
      }}
    >
      {({
        errors,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        setFieldTouched,
        setFieldValue,
        setFieldError,
        resetForm
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            pb={4}
          >
            <Grid
              item
              xs={12}
              md={6}
            >
              <Box pb={0.5}>
                <b>Region</b>
              </Box>
              <Autocomplete
                fullWidth
                disablePortal
                options={regions}
                getOptionLabel={(option) => option.Name}
                defaultValue={defaultRegionValue}
                isOptionEqualToValue={(option, value) => option.Id === value.Id}
                renderInput={(params) =>
                  <TextField
                    {...params}
                    placeholder="Region"
                    name="RegionId"
                    onBlur={() => setFieldTouched("RegionId", true)}
                    error={Boolean(touched.RegionId && errors.RegionId)}
                    helperText={touched.RegionId && errors.RegionId}
                  />
                }
                onChange={(e, value) => handleStates(value, values, resetForm)}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >
              <Box pb={0.5}>
                <b>State</b>
              </Box>
              <Autocomplete
                key={values.RegionId}
                fullWidth
                disablePortal
                options={states}
                getOptionLabel={(option) => option.Name}
                defaultValue={defaultStateValue}
                isOptionEqualToValue={(option, value) => option.Id === value.Id}
                renderInput={(params) =>
                  <TextField
                    {...params}
                    placeholder="State"
                    name="StateId"
                    onBlur={() => setFieldTouched("StateId", true)}
                    error={Boolean(touched.StateId && errors.StateId)}
                    helperText={touched.StateId && errors.StateId}
                  />
                }
                onChange={(e, value) => handleDistricts(value, values, resetForm)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormikControl
                key={values.StateId}
                control='selectAsync'
                isMulti={false}
                closeMenuOnSelect={false}
                name="DistrictId"
                label='District'
                touched={touched.DistrictId}
                error={errors.DistrictId}
                value={values.DistrictId}
                loadOptions={districtLoadOptions}
                defaultValue={defaultDistrictValue}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                setFieldError={setFieldError}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormikControl
                control='selectAsync'
                isMulti
                closeMenuOnSelect
                name="PinCodeIds"
                label='Pin Codes'
                touched={touched.PinCodeIds}
                error={errors.PinCodeIds}
                value={values.PinCodeIds}
                loadOptions={pinCodeLoadOptions}
                defaultValue={defaultPinCodeValues}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                setFieldError={setFieldError}
              />
            </Grid>

            <Grid item xs={12}>
              <FormikControl
                control='input'
                name='Name'
                label='Name'
                error={errors.Name}
                touched={touched.Name}
                value={values.Name}
              />
            </Grid>
          </Grid>
          <Divider />
          <Grid
            container
            direction="row"
            justifyContent="end"
            spacing={2}
            pt={4}
          >
            <Grid item>
              <Link to='/cities' style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  color="error"
                >
                  Cancel
                </Button>
              </Link>

            </Grid>
            <Grid item>
              <Button
                type="submit"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={Boolean(errors.submit) || isSubmitting}
                variant="contained"
              >
                {buttonLabel}
              </Button>
            </Grid>

          </Grid>
        </form>
      )}
    </Formik>
  )
}

export default Form
