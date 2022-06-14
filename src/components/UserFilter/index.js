import React from 'react';
import {
  TextField,
  Grid,
  InputAdornment,
  IconButton
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

function UserFilter(props) {
  const {
    EmpCode,
    setEmpCode,
    Name,
    setName,
    Username,
    setUsername
  } = props;

  return (
    <>
      {/* EmpCode */}
      <Grid
        item
        xs={12}
        md={3.5}
        lg={3}
        xl={2}
      >
        <TextField
          size="small"
          fullWidth
          label="Emp Code"
          value={EmpCode}
          onChange={(e) => setEmpCode(e.target.value)}
          InputProps={{
            endAdornment: EmpCode && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setEmpCode('');
                  }}
                  edge="end"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          InputLabelProps={{
            style: { color: '#000000' },
          }}
        />
      </Grid>

      {/* Name */}
      <Grid
        item
        xs={12}
        md={3.5}
        lg={3}
        xl={2}
      >
        <TextField
          size="small"
          fullWidth
          label="Name"
          value={Name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            endAdornment: Name && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setName('');
                  }}
                  edge="end"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          InputLabelProps={{
            style: { color: '#000000' },
          }}
        />
      </Grid>

      {/* Username */}
      <Grid
        item
        xs={12}
        md={3.5}
        lg={3}
        xl={2}
      >
        <TextField
          size="small"
          fullWidth
          label="Username"
          value={Username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            endAdornment: Username && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setUsername('');
                  }}
                  edge="end"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          InputLabelProps={{
            style: { color: '#000000' },
          }}
        />
      </Grid>
    </>
  );
}

export default UserFilter;
