import { FormControl, Select, MenuItem, Typography, Box } from '@mui/material'
import { ErrorMessage, Field } from 'formik'

function FormikSelect(props) {
  const { name, value, label, options, error, touched, onChange, ...rest } = props

  return (
    <Box height={84}>
      <FormControl fullWidth>
        <Box pb={0.5}>
          <b>{label}</b>
        </Box>
        <Field
          {...rest}
          name={name}
          as={Select}
          value={value}
          placeholder={label}
          error={Boolean(error && touched)}
          onChange={onChange}
        >
          {options.map((option, key) => (
            <MenuItem key={key} value={option.Value}>{option.Name}</MenuItem>
          ))}
        </Field>

        <Typography pl={1} fontWeight='bold' color="red">
          <ErrorMessage name={name} />
        </Typography>
      </FormControl>

    </Box>
  )
}

export default FormikSelect;
