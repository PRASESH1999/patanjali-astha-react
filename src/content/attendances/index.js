import React,
{
  useState
}
  from 'react'
import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import {
  Box,
  Button,
  Grid,
  Typography
} from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { styled } from '@mui/material/styles';
import Results from './blocks/Results'
import ExportToCsv from './popups/ExportToCsv'

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

function Attendances() {
  const [csvOpen, setCsvOpen] = useState(false);
  
  const handleExportToCsvOpen = () => {
    setCsvOpen(true)
  }
  
  const handleExportToCsvClose = () => {
    setCsvOpen(false)
  }
  return (
    <>
      <Helmet>
        <title>Attendances</title>
      </Helmet>

      <PageHeaderWrapper className="MuiPageTitle-wrapper">
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              Attendance
            </Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              spacing={2}
            >
              <Grid item>
                <Button
                  sx={{
                    mt: { xs: 2, sm: 0 }
                  }}
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExportToCsvOpen}
                >
                  Export To CSV
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </PageHeaderWrapper>


      <Results />
      
      <ExportToCsv
        open={csvOpen}
        handleExportToCsvClose={handleExportToCsvClose}
      />

      <Outlet />
    </>
  )
}

export default Attendances