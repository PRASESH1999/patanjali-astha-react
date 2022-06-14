import React from 'react'
import { ErrorMessage, Field } from 'formik'
import { TextField } from '@mui/material'
import { Box } from '@mui/system'

function Input(props) {
  const { label, name, type, ac, error, touched, value, ...rest } = props

  return (
    <Box
      height={84}
    >
      <Box pb={0.5}>
        <b>{label}</b>
      </Box>
      <Field
        {...rest}
        fullWidth
        as={TextField}
        autoComplete="off"
        placeholder={label}
        type={type}
        name={name}
        value={value}
        error={Boolean(error && touched)}
        helperText={<ErrorMessage name={name} />}
      />
    </Box>

  )
}

export default Input