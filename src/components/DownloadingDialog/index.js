import React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material';

function DownloadingDialog(props) {
  const {
    open,
    progress,
    handleCancel
  } = props;

  return (
    <Dialog
      open={open}
    >
      <DialogTitle>
        Your File is being downloaded
      </DialogTitle>

      <DialogContent
        dividers
      >
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />

            <Typography
              variant="h5"
            >
              {progress.toFixed(2)} MB Downloaded
            </Typography>
          </Stack>
          <Button
            onClick={handleCancel}
            color="error"
            variant='contained'
          >
            Cancel
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default DownloadingDialog