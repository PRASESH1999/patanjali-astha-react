import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import React from 'react';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { FormHelperText, TextField } from '@mui/material';

function DatePicker(props) {
  const {
    renderInput,
    onChange,
    value,
    inputFormat,
    label,
    name,
    error,
    touched,
    onBlur,
    ...rest
  } = props

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        {...rest}
        label={label}
        inputFormat={inputFormat}
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            fullWidth
            InputLabelProps={{
              style: { color: '#000000' },
            }}
            name={name}
            error={Boolean(error && touched)}
            onBlur={onBlur}
            {...params}
          />
        )}
      />
      <FormHelperText sx={{color: 'red'}} error={Boolean(error && touched)}>{error}</FormHelperText>
    </LocalizationProvider>
  );
}
export default DatePicker