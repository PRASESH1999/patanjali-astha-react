import React from 'react'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';

export default function SelectStatus(props) {
  const {
    Status,
    setStatus
  } = props;

  return (
    <Grid
      item
      xs={8}
      md={3.5}
      lg={2.5}
      xl={2}
    >
      <FormControl 
        fullWidth 
        size='small'
      >
        <InputLabel
          style = {{
            color: '#223354'
          }} 
          id="status-select-tag"
        >
          Status
        </InputLabel>
        <Select
          labelId="status-select-tag"
          name="Status"
          label="Status"
          value={Status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
          variant="outlined"
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  )
}
