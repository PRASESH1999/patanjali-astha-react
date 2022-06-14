import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
import { Formik } from 'formik';
import FormikControl from 'src/components/Formik/FormikControl';
import {
  Box,
  Button,
  FormHelperText,
  Typography,
  CircularProgress,
  Card,
  Grid
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';

const Login = () => {
  const { login } = useAuth();
  const isMountedRef = useRefMounted();

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <Grid
        container
        height='100vh'
        alignItems="center"
        justifyContent="center"
        spacing={0}
        px={2}
      >
        <Card
          sx={{
            px: 4,
            py: 6
          }}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={6}
          >
            <Grid
              item
            >
              <Box
                component="img"
                sx={{
                  height: 233,
                  width: 350,
                  align: "center",
                  maxHeight: { xs: 60, md: 70 },
                  maxWidth: { xs: 240, md: 280 },
                }}
                alt="Patanjali Logo"
                src="/static/images/patanjaliLogo/logo.png"
              />
            </Grid>

            <Grid
              item
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  Sign in
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  Fill in the fields below to sign into your account .
                </Typography>
              </Box>
              <Formik
                initialValues={{
                  Username: '',
                  Password: '',
                  submit: null,
                  error: ''
                }}
                validationSchema={Yup.object().shape({
                  Username: Yup.string()
                    .max(255)
                    .required('The username field is required'),
                  Password: Yup.string()
                    .max(255)
                    .required('The password field is required'),
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting, setFieldError }) => {
                  try {
                    await login(values);

                    if (isMountedRef.current) {
                      setStatus({ success: true });
                      setSubmitting(false);
                    }
                  } catch (err) {
                    console.error(err.response);

                    const response = err.response;

                    if (isMountedRef.current) {
                      setStatus({ success: false });
                      setErrors({ submit: err.data });
                      setSubmitting(false);
                    }

                    if (response.status === 401) {
                      setFieldError('terms', 'Incorrect credentials')
                    }
                  }
                }}
              >
                {({
                  errors,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values
                }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={12}
                      >
                        <FormikControl
                          control='input'
                          label='Username'
                          name='Username'
                          value={values.Username}
                          error={errors.Username}
                          type='Username'
                          touched={touched.Username}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                      >
                        <FormikControl
                          control='input'
                          label='Password'
                          name='Password'
                          value={values.Password}
                          error={errors.Password}
                          type='Password'
                          touched={touched.Password}
                        />
                      </Grid>
                    </Grid>

                    <FormHelperText error>{errors.terms}</FormHelperText>

                    <Button
                      sx={{
                        mt: 3
                      }}
                      color="primary"
                      startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                      disabled={isSubmitting}
                      type="submit"
                      fullWidth
                      size="large"
                      variant="contained"
                    >
                      Sign in
                    </Button>
                  </form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default Login;
