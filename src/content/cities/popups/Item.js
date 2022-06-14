import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCityItem } from 'src/slices/city';
import {
  Alert,
  Drawer,
  IconButton,
  Typography,
  Grid,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DetailBox from 'src/components/DetailBox';
import SuspenseLoader from 'src/components/SuspenseLoader';

function Item() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [city, setCity] = useState({});
  const [isCity, setIsCity] = useState(false);
  const [error, setError] = useState("");

  useEffect(async () => {
    // Getting city item
    const response = await getCityItem(id);

    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    };

    setCity(response);
    setIsCity(true);
  }, []);

  return (
    <Drawer
      variant="temporary"
      anchor='right'
      onClose={() => navigate('/cities')}
      open
    >

      {isCity ? (
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
                  City Details
                </Typography>
              </Grid>

              <Grid item>
                <Link to="/cities">
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
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<AssignmentIndIcon color="secondary" />}
                      label="Name"
                      value={city.Name}
                    />
                  </Grid>
                  
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<AssignmentIndIcon color="secondary" />}
                      label="Region"
                      value={city.RegionName}
                    />
                  </Grid>
                  
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<AssignmentIndIcon color="secondary" />}
                      label="State"
                      value={city.StateName}
                    />
                  </Grid>
                  
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<AssignmentIndIcon color="secondary" />}
                      label="District"
                      value={city.DistrictName}
                    />
                  </Grid>
                  
                  
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<AssignmentIndIcon color="secondary" />}
                      label="Pin Codes"
                      value={city.PinCodes.map((pinCode) => pinCode.Name).join(',')}
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