import * as React from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';

export default function BasicDateRangePicker(props) {

const {
    value,
    onChange,
    startTextLabel,
    endTextLabel,
} = props
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        startText={startTextLabel}
        endText={endTextLabel}
        value={value}
        onChange={onChange}
        renderInput={(startProps, endProps) => (
          <Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </Fragment>
        )}
      />
    </LocalizationProvider>
  );
}