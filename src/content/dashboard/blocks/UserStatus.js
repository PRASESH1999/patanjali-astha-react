import {
  Card,
  CardHeader,
  Typography,
  Box,
  Grid,
  useTheme,
  styled
} from '@mui/material';
import Chart from 'react-apexcharts';

const BoxChartWrapperText = styled(Box)(
  () => `
    position: relative;
    width: 210px;
    height: 210px;
    
    .ChartText {
      position: absolute;
      z-index: 7;
      height: 40px;
      width: 40px;
      top: 50%;
      left: 50%;
      margin: -31px 0 0 -19px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
`
);

function UserStatus(props) {

  const{
    presentUserCount,
    activeUserCount
  } = props

  let presentPercent = 0;

  if(presentUserCount !== 0) {
    presentPercent = Math.round((1*100)/activeUserCount);
  }

  const absentPercent = 100-presentPercent

  const theme = useTheme();

  const chartOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%'
        }
      }
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.1
        }
      },
      active: {
        filter: {
          type: 'none'
        }
      }
    },
    colors: [
      theme.colors.success.main,
      // alpha(theme.colors.secondary.main, 0.3),
      theme.colors.error.main,
      // "#0400ff"
    ],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${val}%`;
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      enabled: false
    }
  };

  const chartSeries = [presentPercent, absentPercent];

  return (
    <Card
      sx={{
        height: '100%'
      }}
    >
      <CardHeader
        title='User Status'
      />

      <Box
        sx={{
          p: 2
        }}
      >
        <Grid container spacing={6} alignItems="center">

          <Grid item xs={12} sm={7} >
            <BoxChartWrapperText>
              <Chart
                height="100%"
                width="100%"
                options={chartOptions}
                series={chartSeries}
                type="donut"
              />
            </BoxChartWrapperText>
          </Grid>

          <Grid item xs={12} sm={5} >
            <Box
              sx={{
                mt: `-${theme.spacing(2)}`
              }}
              display="flex"
              alignItems="flex-start"
              flexGrow={1}
              flexDirection="column"
            >
              <Box
                sx={{
                  pb: 1
                }}
              >
                <Typography
                  color="text.primary"
                  variant="h1"
                  lineHeight={1}
                  sx={{
                    pr: 0.5,
                    display: 'inline-flex',
                    fontSize: `${theme.typography.pxToRem(50)}`
                  }}
                >
                  {presentUserCount}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="h2"
                  lineHeight={1}
                  sx={{
                    pr: 2,
                    display: 'inline-flex'
                  }}
                >
                  /{activeUserCount}
                </Typography>
              </Box>

            </Box>
          </Grid>

        </Grid>
      </Box>

      {/* <Divider />

      <Box
        p={2}
        sx={{
          textAlign: 'center'
        }}
        alignContent = "center"
      >
        <List
          disablePadding
          sx={{
            width: '100%'
          }}
        >
          <ListItem
            disableGutters
            sx={{
              py: 0.2
            }}
          >
            <ListItemText
              primary='Total number of users'
              primaryTypographyProps={{ variant: 'subtitle2' }}
            />
            <Box display="flex" alignItems="center">
              <Text color='primary'>
                <b>9999</b>
              </Text>
              <AvatarSuccess
                sx={{
                  ml: 1
                }}
              >
                <CheckTwoToneIcon />
              </AvatarSuccess> 
            </Box>
          </ListItem>

          <ListItem
            disableGutters
            sx={{
              py: 0.2
            }}
          >
            <ListItemText
              primary='Present users'
              primaryTypographyProps={{ variant: 'subtitle2' }}
            />
            <Box display="flex" alignItems="center">
              <Text color= 'success'>
                999
              </Text>
              <AvatarSuccess
                sx={{
                  ml: 1
                }}
              >
                <CheckTwoToneIcon />
              </AvatarSuccess> 
            </Box>
          </ListItem>

          <ListItem
            disableGutters
            sx={{
              py: 0.2
            }}
          >
            <ListItemText
              primary='Absent Users'
              primaryTypographyProps={{ variant: 'subtitle2' }}
            />
            <Box display="flex" justifyContent="center">
              <Text color="error">
                <b>9000</b>
              </Text>
              <AvatarError
                sx={{
                  ml: 1
                }}
              >
                <CloseTwoToneIcon />
              </AvatarError> 
            </Box>
          </ListItem>
        </List>
      </Box> */}

    </Card>
  );
}

export default UserStatus;
