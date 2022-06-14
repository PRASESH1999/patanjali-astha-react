import React from 'react'
import { Link } from 'react-router-dom';
import {
  Grid,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormikControl from 'src/components/Formik/FormikControl';

const Form = (props) => {
  const {
    pinCode,
    handleSubmit,
    buttonLabel
  } = props;

  const validationSchema = Yup.object().shape({
    Name: Yup.string()
      .required(),
  });

  const initialValues = {
    Name: pinCode.Name || "",
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
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            pb={4}
          >
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
              <Link to='/pin-codes' style={{ textDecoration: 'none' }}>
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
