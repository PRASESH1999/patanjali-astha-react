import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Drawer,
  IconButton,
  Typography,
  Grid,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { getAdminItem } from 'src/slices/admin';
import DetailBox from 'src/components/DetailBox';
import SuspenseLoader from 'src/components/SuspenseLoader';

function Item() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  useEffect(async () => {
    // Getting admin item
    const response = await getAdminItem(id);

    if (response.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    };

    setAdmin(response);
    setIsAdmin(true);
  }, []);

  return (
    <Drawer
      variant="temporary"
      anchor='right'
      onClose={() => navigate('/admins')}
      open
    >

      {isAdmin ? (
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
                  Admin Details
                </Typography>
              </Grid>

              <Grid item>
                <Link to="/admins">
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
                      value={admin.Name}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<MailOutlineIcon color="secondary" />}
                      label="Email"
                      value={admin.Email}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<PersonOutlineIcon color="secondary" />}
                      label="Username"
                      value={admin.Username}
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