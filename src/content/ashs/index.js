import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import axios from 'axios';
import UserPageHeader from 'src/components/UserPageHeader';
import DownloadingDialog from 'src/components/DownloadingDialog';
import Results from './blocks/Results'

function ASHs() {
  const CancelToken = axios.CancelToken;
  let isAborted = false;

  const [progress, setProgress] = useState(0);
  const [source, setSource] = useState(axios.CancelToken.source)
  const [open, setOpen] = useState(false)

  const handleDownloadOpen = () => {
    setOpen(true);
  }

  const handleDownloadClose = () => {
    setOpen(false);
  }

  const handleExport = async () => {
    handleDownloadOpen();
    try {
      const response = await createApiEndpoint(ENDPOINTS.ASH).userExport(
        {
          onDownloadProgress: (progressEvent) => {
            const total = progressEvent.loaded;
            setProgress(total / 1048576);
          },
        },
        source,
      );

      const blob = new Blob([response.data], { type: 'text/csv' });

      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = 'ashs.csv';
      a.click();
      handleDownloadClose();
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancelExport = () => {
    source.cancel('Operation canceled by the user.');
    isAborted = true;
    handleDownloadClose();
  };

  const handleExportAgain = () => {
    isAborted = false
    setSource(CancelToken.source());
  };

  return (
    <>
      <Helmet>
        <title>ASHs</title>
      </Helmet>

      <UserPageHeader
        title="ASHs"
        addLabel="Add ASH"
        addLink="/ashs/create"
        exportFunction={handleExport}
        cancelExport={handleCancelExport}
        exportAgain={handleExportAgain}
        isAborted={isAborted}
        progress={progress}
      />

      <Results />

      <Outlet />

      {
        open && (
          <DownloadingDialog
            open={open}
            progress={progress}
            handleCancel={handleCancelExport}
          />
        )
      }
    </>
  )
}

export default ASHs;