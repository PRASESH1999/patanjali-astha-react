import React, {useState} from 'react';
// import { Link } from 'react-router-dom';
import {
  Grid,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik } from 'formik';
import FormikControl from 'src/components/Formik/FormikControl';
import * as Yup from 'yup';
import axios from 'axios';
import moment from 'moment';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';

const Form = ({open, handleExportToCsvClose}) => {

  const CancelToken = axios.CancelToken;
  let isAborted = false;

  const [progress, setProgress] = useState(0);
  const [source, setSource] = useState(axios.CancelToken.source)

  const convertedDate = (date) =>
    moment(date).format('YYYY-MM-DD');

  const initialValues = {
    startDate: new Date(),
    endDate: new Date()
  };

  const validationSchema = Yup.object().shape({
    startDate: Yup.date()
      .max(new Date(), 'The start date must be earlier than today')
      .required(),
    endDate: Yup.date().required()
  });

  const handleSubmit = async (values, setSubmitting, setFieldError) => {
    if (values.startDate > values.endDate)
      setFieldError(
        'endDate',
        'The end date must be a date after or equal to start date.'
      );

    const startDate = convertedDate(values.startDate);
    const endDate = convertedDate(values.endDate);

    try {
      const response = await createApiEndpoint(ENDPOINTS.ATTENDANCE).export(
        startDate,
        endDate,
        {
          onDownloadProgress: (progressEvent) => {
            const total = progressEvent.loaded;
            setProgress(total / 1048576);

          },
        },
        source,
      );

      const blob = new Blob([response.data], { type: 'text/csv' });

      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = 'attendance.csv';
      a.click();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    source.cancel('Operation canceled by the user.');
    isAborted = true;
  };

  const handleDownloadAgain = () => {
    isAborted = false;
    setSource(CancelToken.source());
  };

  return (
    <Drawer
      variant="temporary"
      anchor='right'
      open={open}
    >

      {open && (
        <Grid
          container
          maxWidth={500}
          
        >
          <Grid item xs={12}>
            <Grid
              container
              justifyContent="space-between"
              p={2}
            >
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  Export to CSV
                </Typography>
              </Grid>

              <Grid item>
                <IconButton
                  color="error"
                  onClick={handleExportToCsvClose}
                >
                  <CloseIcon fontSize='medium' />
                </IconButton>
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
                    setFieldValue,
                    setFieldTouched,
                    touched,
                    values
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <Grid container gap={3}>
                        <Grid item xs={12}>
                          <FormikControl
                            control="date"
                            label="Start Date"
                            inputFormat="yyyy-MM-dd"
                            mask="____-__-__"
                            name="startDate"
                            value={values.startDate}
                            error={errors.startDate}
                            touched={touched.endDate}
                            onChange={(newValue) =>
                              setFieldValue('startDate', newValue, true)
                            }
                            onBlur={() => setFieldTouched('startDate', true, true)}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormikControl
                            control="date"
                            label="End Date"
                            inputFormat="yyyy-MM-dd"
                            mask="____-__-__"
                            name="endDate"
                            value={values.endDate}
                            error={errors.endDate}
                            touched={touched.endDate}
                            onChange={(newValue) =>
                              setFieldValue('endDate', newValue, true)
                            }
                            onBlur={() => setFieldTouched('endDate', true, true)}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        pt={4}
                      >
                        {isAborted ? (
                          <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            onClick={handleDownloadAgain}
                          >
                            Export
                          </Button>
                        ) : isSubmitting ? (
                          <>
                            <Button
                              startIcon={<CircularProgress size="1rem" />}
                              color="error"
                              variant="outlined"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                            <Typography
                              ml={2}
                              variant="subtitle2"
                              fontWeight="bold"
                            >
                              {progress.toFixed(2)} MB Downloaded
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Button type="submit" color="primary" variant="contained">
                              Export to CSV
                            </Button>
                          </>
                        )}
                      </Grid>
                    </form>
                  )}
                </Formik>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Drawer>
  )
}

export default Form
