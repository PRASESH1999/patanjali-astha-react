import {
  Grid,
  Box
} from '@mui/material';

function Logo() {

  return (
          <Grid container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            
            <Box
              component="img"
              sx={{
                maxHeight: 40,
                maxWidth: 160,
              }}
              alt="Patanjali Logo"
              src={`${process.env.PUBLIC_URL}/static/images/Logo/PatanjaliLogo.png`}
            />
          </Grid>
  );
}

export default Logo;
