import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  styled
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

function Status401() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Status - 401</title>
      </Helmet>
      <MainContent>
        <Grid
          container
          sx={{
            height: '100%'
          }}
          alignItems="stretch"
          spacing={0}
        >
          <Grid
            xs={12}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container>
              <Box textAlign="center">
                <img
                  alt="500"
                  height={260}
                  src="/static/images/status/500.svg"
                />
                <Typography
                  variant="h2"
                  sx={{
                    my: 2
                  }}
                >
                  {t('You are not authorized to use this page.')}
                </Typography>
                <Button
                  href="/dashboard"
                  variant="contained"
                  sx={{
                    ml: 1
                  }}
                >
                  {t('Go to dashboard')}
                </Button>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </MainContent>
    </>
  );
}

export default Status401;
