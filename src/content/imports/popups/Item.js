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
import { getImportItem } from 'src/slices/import';
import DetailBox from 'src/components/DetailBox';
import SuspenseLoader from 'src/components/SuspenseLoader';

function Item() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [importItem, setImportItem] = useState({});
  const [isImport, setIsImport] = useState(false);
  const [error, setError] = useState("");

  useEffect(async () => {
    // Getting import item
    const response = await getImportItem(id);

    if (response?.status === 400) {
      if (response.data.Id) {
        setError(response.data.Id[0]);
      }
    };

    setImportItem(response);
    setIsImport(true);
  }, []);

  return (
    <Drawer
      variant="temporary"
      anchor='right'
      onClose={() => navigate('/imports')}
      open
    >

      {isImport ? (
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
                  Import Details
                </Typography>
              </Grid>

              <Grid item>
                <Link to="/imports">
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
                      label="Id"
                      value={importItem?.Id}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<AssignmentIndIcon color="secondary" />}
                      label="Type"
                      value={importItem?.Type}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<AssignmentIndIcon color="secondary" />}
                      label="Filename"
                      value={importItem?.Filename}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<MailOutlineIcon color="secondary" />}
                      label="Status"
                      value={importItem?.Status}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<PersonOutlineIcon color="secondary" />}
                      label="Remarks"
                      value={importItem?.Remarks}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<PersonOutlineIcon color="secondary" />}
                      label="Error Message"
                      value={importItem?.ErrorMessage}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<PersonOutlineIcon color="secondary" />}
                      label="Error Trace"
                      value={importItem?.ErrorTrace}
                    />
                  </Grid>
                  <Grid item xs={12} borderBottom="1px solid #ECECEC">
                    <DetailBox
                      icon={<PersonOutlineIcon color="secondary" />}
                      label="User"
                      value={importItem?.UserName}
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