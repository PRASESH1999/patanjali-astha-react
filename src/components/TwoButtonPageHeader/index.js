import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  styled,
  Typography,
} from '@mui/material';
// import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

const PageHeaderWrapper = styled(Box)(
  ({ theme }) => `
    padding-right: ${theme.spacing(2)};
    padding-left: ${theme.spacing(2)};
    padding-top: ${theme.spacing(2)};
    margin-bottom: ${theme.spacing(2)};
    border-radius: 0;
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      left: ${theme.spacing(30)};
      width: full;
  }
  `
);

const PageHeader = (props) => {
  const {
    title,
    button1Label,
    button1Link,
    button2Label,
    button2Link,
    icon1,
    icon2,
  } = props;

  return (
    <>
      <PageHeaderWrapper className="MuiPageTitle-wrapper">
        <Grid container justifyContent="space-between" alignItems="center">

          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {title}
            </Typography>
          </Grid>

          <Grid item>

            <Grid
              container
              spacing={2}
            >

              <Grid item>
                <Link to={button1Link} style={{ textDecoration: "none" }}>
                  <Button
                    sx={{
                      mt: { xs: 2, sm: 0 }
                    }}
                    variant="contained"
                    startIcon={icon1}
                  >
                    {button1Label}
                  </Button>
                </Link>
              </Grid>

              <Grid item>
                <Link to={button2Link} style={{ textDecoration: "none" }}>
                  <Button
                    sx={{
                      mt: { xs: 2, sm: 0 }
                    }}
                    variant="contained"
                    startIcon={icon2}
                  >
                    {button2Label}
                  </Button>
                </Link>
              </Grid>

            </Grid>

          </Grid>

        </Grid>
      </PageHeaderWrapper>
    </>
  );
};

export default PageHeader;
