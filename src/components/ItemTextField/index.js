import { TextField } from '@mui/material'
import React from 'react'

function ItemTextField({ label, value }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      value={value || ""}
      InputProps={{
        readOnly: true,
      }}
      InputLabelProps={{
        style: { color: '#000000' },
      }}
    // size="small"
    />
  )
}

export default ItemTextField;
