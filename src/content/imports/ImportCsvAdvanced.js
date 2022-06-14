import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { downloadTableFormatAdvanced, getTablesAdvanced, importCsvAdvanced } from 'src/slices/import';
import {
  Card,
  Grid,
  Button,
  CircularProgress,
  Zoom,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { Formik } from 'formik';
import FormikControl from 'src/components/Formik/FormikControl';
import * as Yup from 'yup';
import PageHeader from 'src/components/PageHeader';

const ImportCsvAdvanced = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [tables, setTables] = useState([]);

  useEffect(async () => {
    const response = await getTablesAdvanced();
    setTables(response)
  }, [])


  const initialValues = {
    Table: "",
  };

  const validationSchema = Yup.object().shape({
    Table: Yup.string()
      .required(),
    Csv: Yup.mixed().required(),
  });

  const handleDownloadFormat = async (id) => {
    try {
      const response = await downloadTableFormatAdvanced(id);

      const blob = new Blob([response.data], { type: 'text/csv' });

      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = id;
      a.click();
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (values, setSubmitting, setFieldError, resetForm) => {
    const formData = new FormData();

    try {
      formData.append("Table", values.Table);
      formData.append("Csv", values.Csv);

      await importCsvAdvanced(formData);
      resetForm();

      window.location.reload();

      enqueueSnackbar(("Imported Successfully"), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
    } catch (error) {
      setSubmitting(false);

      const response = error.response;

      if (response.status === 400) {
        if (response.data.Table) {
          setFieldError("Table", response.data.Table[0]);
        };
        if (response.data.Csv) {
          setFieldError("Csv", response.data.Csv[0]);
        };
      };
    };
  };

  return (
    <>
      <Helmet>
        <title>Import from CSV Advanced</title>
      </Helmet>

      <PageHeader
        title="Import from CSV Advanced"
        disableButton
      />

      <Card
        sx={{
          p: 4,
          mx: 2
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
            await handleSubmit(values, setSubmitting, setFieldError, resetForm);
          }}
        >
          {({
            errors,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container gap={3}>
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} lg={9.5} xl={10.5}>
                      <FormikControl
                        control='select'
                        name='Table'
                        label='Table'
                        error={errors.Table}
                        touched={touched.Table}
                        value={values.Table}
                        options={tables}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} lg={2.5} xl={1.5}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleDownloadFormat(values.Table)}
                      >
                        Download Format
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <FormikControl
                    control='input'
                    type="file"
                    name='Csv'
                    label='Csv'
                    error={errors.Csv}
                    touched={touched.Csv}
                    onChange={(event) => {
                      setFieldValue("Csv", event.currentTarget.files[0]);
                    }}
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
                <Button
                  type="submit"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                >
                  Import
                </Button>
              </Grid>
            </form>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default ImportCsvAdvanced;
