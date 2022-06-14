import { Autocomplete, Checkbox, TextField, Box } from '@mui/material'
import React from 'react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function AutocompleteMultiple(props) {
  const {
    name,
    isReset,
    // value,
    label,
    options,
    error,
    touched,
    selectedOptions,
    setFieldValue,
    setFieldTouched,
  } = props

  const handleChange = (value) => {
    const newValue = value.map((nv) => nv.Id);
    setFieldValue(name, newValue);
  };

  return (
    <Box>
      <Box pb={0.5}>
        <b>{label}</b>
      </Box>
      <Autocomplete
        key = {isReset}
        multiple
        fullWidth
        disableCloseOnSelect
        name={name}
        options={options}
        defaultValue={selectedOptions}
        isOptionEqualToValue={(option, value) => option.Id === value.Id}
        getOptionLabel={(option) => option.Name}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.Id}>
            <Checkbox
              key={option.Id}
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.Name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            name={name}
            onBlur={() => setFieldTouched(name, true)}
            error={Boolean(touched && error)}
            helperText={touched && error}
            InputLabelProps={{
              style: { color: '#000000' },
            }}
            {...params}
          />
        )}
        onChange={(e, value) => handleChange(value)}
      />
    </Box>
  )
}

export default AutocompleteMultiple
