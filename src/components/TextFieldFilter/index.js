import React from 'react'
import {
  Grid, 
  IconButton, 
  InputAdornment, 
  TextField,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

export default function TextFieldFilter(props) {
  const {
    label,
    filter,
    setFilter
  } = props;

  return (
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
        label={label}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        InputProps={{
          endAdornment:
            filter &&
            (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setFilter("")
                  }}
                  edge="end"
                >
                  <CancelIcon fontSize='small' />
                </IconButton>
              </InputAdornment>
            )
        }}
        InputLabelProps={{
          style: { color: '#000000' },
        }}
      />
    </Grid>
  )
}
