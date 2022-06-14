import React from 'react'
import { ErrorMessage, Field } from 'formik'
import { TextField } from '@mui/material'

function Input(props) {
  const { label, name, type, ac, error, touched, value, shrink, ...rest } = props

  return (
    <>
      <Field
        {...rest}
        fullWidth
        as={TextField}
        autoComplete="off"
        label={label}
        type={type}
        name={name}
        value={value}
        error={Boolean(error && touched)}
        helperText={<ErrorMessage name={name} />}
        InputLabelProps={{
          style: { color: '#000000'},
          shrink
        }}
      />
    </>

  )
}

export default Input