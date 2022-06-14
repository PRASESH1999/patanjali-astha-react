import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, CircularProgress, Divider, Box, Autocomplete, TextField } from '@mui/material';
import { Formik } from 'formik';
import FormikControl from 'src/components/Formik/FormikControl';
import { hasRole } from 'src/utils/auth';
// import { hasRole } from 'src/utils/auth';

const Form = (props) => {
  const {
    ash,
    validationSchema,

    defaultStateValues,
    states,

    regions,
    defaultRegionValue,
    handleStates,

    loadOptions,
    defaultShValue,

    handleSubmit,
    buttonLabel,
  } = props;

  const initialValues = {
    RegionId: ash.RegionId || '',
    StateIds: ash.States?.map((state) => state.Id) || [],
    ShId: ash.ShId || '',
    EmpCode: ash.EmpCode || '',
    Name: ash.Name || '',
    Email: ash.Email || '',
    ContactNumber: ash.ContactNumber || '',
    Username: ash.Username || '',
    Password: '',
    PasswordConfirmation: ''
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
        setFieldTouched,
        touched,
        errors,
        values,
        resetForm,
        setFieldValue,
        setFieldError,
        isSubmitting,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            pb={4}
          >
            {
              hasRole(['admin', 'mis']) &&
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
                      error={Boolean(touched.RegionId && errors.RegionId)}
                      helperText={touched.RegionId && errors.RegionId}
                    />
                  }
                  onChange={(e, value) => handleStates(value, values, resetForm)}
                />
              </Grid>
            }

            <Grid item xs={12} >
              <FormikControl
                control='autocompleteMultiple'
                name='StateIds'
                label='State'
                error={errors.StateIds}
                touched={touched.StateIds}
                selectedOptions={defaultStateValues}
                value={values.StateIds}
                options={states}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                isReset={values.RegionId}
              />
            </Grid>


            {
              hasRole(['admin', 'mis']) &&
              <Grid item xs={12} md={6}>
                <FormikControl
                  control='selectAsync'
                  isMulti={false}
                  closeMenuOnSelect
                  name="ShId"
                  label='SH'
                  touched={touched.ShId}
                  error={errors.ShId}
                  value={values.ShId}
                  loadOptions={loadOptions}
                  defaultValue={defaultShValue}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  setFieldError={setFieldError}
                />
              </Grid>
            }

            <Grid item xs={12} md={6}>
              <FormikControl
                control="input"
                name="EmpCode"
                label="Emp Code"
                error={errors.EmpCode}
                touched={touched.EmpCode}
                value={values.EmpCode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormikControl
                control="input"
                name="Name"
                label="Name"
                error={errors.Name}
                touched={touched.Name}
                value={values.Name}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormikControl
                control="input"
                name="Email"
                label="Email"
                error={errors.Email}
                touched={touched.Email}
                value={values.Email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormikControl
                control="input"
                name="ContactNumber"
                label="Contact Number"
                error={errors.ContactNumber}
                touched={touched.ContactNumber}
                value={values.ContactNumber}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormikControl
                control="input"
                name="Username"
                label="Username"
                error={errors.Username}
                touched={touched.Username}
                value={values.Username}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormikControl
                control="input"
                type="password"
                name="Password"
                label="Password"
                error={errors.Password}
                touched={touched.Password}
                value={values.Password}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormikControl
                control="input"
                type="password"
                name="PasswordConfirmation"
                label="Confirm Password"
                error={errors.PasswordConfirmation}
                touched={touched.PasswordConfirmation}
                value={values.PasswordConfirmation}
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
              <Link to="/ashs" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="error">
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
      )
      }
    </Formik >
  );
};

export default Form;
