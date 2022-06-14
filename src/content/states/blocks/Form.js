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
    state,
    handleSubmit,
    buttonLabel,
    regions,
    defaultRegionValue
  } = props;

  const validationSchema = Yup.object().shape({
    RegionId: Yup.string()
      .required(),
    Name: Yup.string()
      .required(),
    Abbreviation: Yup.string()
      .required(),
    Code: Yup.string()
      .required()
  });

  const initialValues = {
    RegionId: state.RegionId || "",
    Name: state.Name || "",
    Abbreviation: state.Abbreviation || "",
    Code: state.Code || "",
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
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            pb={4}
          >
            <Grid item xs={12}>
              <FormikControl
                control='autocomplete'
                name='RegionId'
                label='Region'
                error={errors.RegionId}
                touched={touched.RegionId}
                defaultValue={defaultRegionValue}
                options={regions}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
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
                name='Abbreviation'
                label='Abbreviation'
                error={errors.Abbreviation}
                touched={touched.Abbreviation}
                value={values.Abbreviation}
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
              <Link to='/states' style={{ textDecoration: 'none' }}>
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
