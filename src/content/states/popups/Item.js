import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Drawer,
  IconButton,
  Typography,
  Grid,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ShortTextIcon from '@mui/icons-material/ShortText';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { getStateItem } from 'src/slices/state';
import DetailBox from 'src/components/DetailBox';
import SuspenseLoader from 'src/components/SuspenseLoader';

function Item() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isState, setIsState] = useState(false)
  const [state, setState] = useState({});
  const [error, setError] = useState("");

  useEffect(async () => {
    // Getting state item
    const response = await getStateItem(id);
    
    if (response?.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    };

    setState(response);
    setIsState(true)
  }, []);

  return (
    <Drawer
      variant="temporary"
      anchor='right'
      onClose={() => navigate('/states')}
      open
    >

      {isState ? (
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
                  State Details
                </Typography>
              </Grid>

              <Grid item>
                <Link to="/states">
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
                      icon={<DriveFileRenameOutlineIcon color="secondary" />}
                      label="Name"
                      value={state.Name}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<ShortTextIcon color="secondary" />}
                      label="Abbreviation"
                      value={state.Abbreviation}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<QrCodeIcon color="secondary" />}
                      label="Code"
                      value={state.Code}
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