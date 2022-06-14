import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAseItem } from 'src/slices/ase';
import {
  Alert,
  Drawer,
  IconButton,
  Typography,
  Grid,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import ApartmentIcon from '@mui/icons-material/Apartment';
import QrCodeIcon from '@mui/icons-material/QrCode';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DetailBox from 'src/components/DetailBox';
import SuspenseLoader from 'src/components/SuspenseLoader';

function Item() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ase, setAse] = useState({});
  const [isAse, setIsAse] = useState(false);
  const [error, setError] = useState("");

  useEffect(async () => {
    // Getting ase item
    const response = await getAseItem(id);

    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    };

    setAse(response);
    setIsAse(true);
  }, []);

  return (
    <Drawer
      variant="temporary"
      anchor='right'
      onClose={() => navigate('/ases')}
      open
    >

      {isAse ? (
        <Grid
          container
          maxWidth={800}
        >
          <Grid item xs={12}>
            <Grid
              container
              justifyContent="space-between"
              p={2}
            >
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  ASE Details
                </Typography>
              </Grid>

              <Grid item>
                <Link to="/ases">
                  <IconButton
                    color="error"
                  >
                    <CloseIcon fontSize='medium' />
                  </IconButton>
                </Link>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
            >
              {error ? (
                <Grid
                  item
                  xs={12}
                  p={2}
                >
                  <Alert variant="filled" severity="error">
                    {error}
                  </Alert>
                </Grid>
              ) : (
                <>
                  <Grid item xs={12} md={6} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<ApartmentIcon color="secondary" />}
                      label="States"
                      value={ase.StateName}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<QrCodeIcon color="secondary" />}
                      label="SH"
                      value={`${ase.ShEmpCode} ${ase.ShName}`}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<QrCodeIcon color="secondary" />}
                      label="ASH"
                      value={`${ase.AshEmpCode} ${ase.AshName}`}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<ApartmentIcon color="secondary" />}
                      label="Regions"
                      value={ase.RegionName}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<QrCodeIcon color="secondary" />}
                      label="Employee Code"
                      value={ase.EmpCode}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<AssignmentIndIcon color="secondary" />}
                      label="Name"
                      value={ase.Name}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<MailOutlineIcon color="secondary" />}
                      label="Email"
                      value={ase.Email}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<PhoneIcon color="secondary" />}
                      label="Contact Number"
                      value={ase.ContactNumber}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<PersonOutlineIcon color="secondary" />}
                      label="Username"
                      value={ase.Username}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      ) : <SuspenseLoader />
      }
    </Drawer >
  )
}

export default Item