import React from 'react'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';

export default function SelectFilter(props) {
  const {
    label,
    filter,
    setFilter,
    options,
    ...rest
  } = props;

  return (
    <Grid
      item
      xs={12}
      md={3.5}
      lg={3}
      xl={2}
    >
      <FormControl
        fullWidth
        size='small'
      >
        <InputLabel
          style={{
            color: '#223354'
          }}
          id="status-select-tag"
        >
          {label}
        </InputLabel>
        <Select
          {...rest}
          labelId="status-select-tag"
          name={filter}
          label={label}
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          variant="outlined"
        >
          <MenuItem value="">All</MenuItem>
          {options.map((option, key) => (
            <MenuItem key={key} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  )
}
