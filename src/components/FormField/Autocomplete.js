import React from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';

export default function AutoComplete(props) {
  const {
    name,
    label,
    options,
    error,
    touched,
    defaultValue,
    setFieldTouched,
    setFieldValue,
    isReset
  } = props;

  const handleChange = (value) => {
    if (value) {
      const newValue = value.Id;
      setFieldValue(name, newValue);
    } else {
      setFieldValue(name, '');
    }
  }

  return (
    <>
      <Box pb={0.5}>
        <b>{label}</b>
      </Box>
      <Autocomplete
        key={isReset}
        fullWidth
        disablePortal
        options={options}
        getOptionLabel={(option) => option.Name}
        defaultValue={defaultValue}
        isOptionEqualToValue={(option, value) => option.Id === value.Id}
        renderInput={(params) =>
          <TextField
            {...params}
            placeholder={label}
            name={name}
            onBlur={() => setFieldTouched(name, true)}
            error={Boolean(touched && error)}
            helperText={touched && error}
          />
        }
        onChange={(e, value) => handleChange(value)}
      />
    </>
  )
}