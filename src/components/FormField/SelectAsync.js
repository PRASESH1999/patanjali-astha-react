import React from 'react'
import { Box, FormHelperText } from '@mui/material';
import { AsyncPaginate } from 'react-select-async-paginate';

function SelectAsync(props) {
  const {
    isMulti,
    closeMenuOnSelect,
    disabled,
    clearKey,
    name,
    label,
    error,
    touched,
    loadOptions,
    setFieldTouched,
    setFieldValue,
    defaultValue,
    setFilter,
  } = props;

  const handleBlur = () => {
    setFieldTouched(name, true);
  };

  const handleChange = (value) => {
    if (isMulti) {
      const newValue = value.map((nv) => nv.value);
      setFieldValue(name, newValue);
    } else {
      const newValue = value.value
      setFieldValue(name, newValue);
      if (setFilter) {
        setFilter(newValue);
      }
    }
  };

  const customStyles = {
    control: (provided) => {

      return ({
        ...provided,
        background: '#fff',
        borderColor: `${error && touched ? 'red' : '#CECECE'}`,
        minHeight: '54px',
        borderRadius: '12px',
      })
    },

    container: (provided) => ({
      ...provided,
    }),

    placeholder: (provided) => ({
      ...provided,
      color: '#C0C0C0',
      fontWeight: '100'
    }),

    menuPortal: base => ({ ...base, zIndex: 9999 }),
  };

  return (
    <Box
      height={!isMulti && 84}
    >
      <Box pb={0.5}>
        <b>{label}</b>
      </Box>
      <AsyncPaginate
        menuPortalTarget={document.body}
        styles={customStyles}
        width="full"
        isMulti={isMulti}
        isClearable
        closeMenuOnSelect={closeMenuOnSelect}
        isDisabled={disabled}
        key={clearKey}
        debounceTimeout={300}
        placeholder={label}
        name={name}
        loadOptions={loadOptions}
        defaultValue={defaultValue}
        onBlur={handleBlur}
        onChange={
          (value) => {
            if (value) {
              handleChange(value)
            } else {
              setFieldValue(name, isMulti ? [] : '');
            }
          }}
        additional={{
          page: 1
        }}
      />
      <FormHelperText error={Boolean(touched && error)}>
        {touched && error && error}
        
      </FormHelperText>
    </Box>
  )
}

export default SelectAsync