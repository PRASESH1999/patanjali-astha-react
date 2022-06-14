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
    district,
    handleSubmit,
    buttonLabel,
    regions,
    defaultRegionValue,
    states,
    defaultStateValue,
    handleStates,
    isReset,
  } = props;

  const validationSchema = Yup.object().shape({
    RegionId: Yup.string()
      .required(),
    StateId: Yup.string()
    .required(),
    Name: Yup.string()
      .required(),
    Code: Yup.string()
      .required()
  });

  const initialValues = {
    RegionId: district.RegionId || "",
    StateId: district.StateId || "",
    Name: district.Name || "",
    Code: district.Code || "",
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
                    error={Boolean(touched && errors.RegionId)}
                    helperText={touched && errors.RegionId}
                  />
                }
                onChange={(e, value) => handleStates(value, values, resetForm)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormikControl
                control='autocomplete'
                name='StateId'
                label='State'
                error={errors.StateId}
                touched={touched.StateId}
                defaultValue={defaultStateValue}
                options={states}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                isReset = {isReset}
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
            <Grid item xs={12}>
              <FormikControl
                control='input'
                name='Code'
                label='Code'
                error={errors.Code}
                touched={touched.Code}
                value={values.Code}
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
              <Link to='/districts' style={{ textDecoration: 'none' }}>
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
