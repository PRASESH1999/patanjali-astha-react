import React from 'react'
import {
  Box,
  Stack,
  Typography,
} from '@mui/material';

function DetailBox({ label, value, icon }) {
  return (
    <Box
      p={2}
    >
      <Stack direction="row" alignItems="center">
        {icon}
        <Typography ml={0.5} variant="subtitle2" fontSize={16}>
          {label}
        </Typography>
      </Stack>

      <Typography variant="h6">
        {value}
      </Typography>
    </Box>
  )
}

export default DetailBox