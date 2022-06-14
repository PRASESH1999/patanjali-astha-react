import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, CircularProgress, Divider } from '@mui/material';
import { Formik } from 'formik';
import FormikControl from 'src/components/Formik/FormikControl';

const Form = (props) => {
  const {
    sh,
    defaultStateValues,
    states,
    handleSubmit,
    buttonLabel,
    validationSchema
  } = props;

  const initialValues = {
    StateIds: sh.States?.map((state) => state.Id) || [],
    EmpCode: sh.EmpCode || '',
    Name: sh.Name || '',
    Email: sh.Email || '',
    ContactNumber: sh.ContactNumber || '',
    Username: sh.Username || '',
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
        errors,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        touched,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            pb={4}
          >
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
              />
            </Grid>

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
              <Link to="/shs" style={{ textDecoration: 'none' }}>
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
      )}
    </Formik>
  );
};

export default Form;
