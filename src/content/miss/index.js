import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import PageHeader from 'src/components/PageHeader';
import Results from './blocks/Results';

function MISs() {
  return (
    <>
      <Helmet>
        <title>MISs</title>
      </Helmet>
      
      <PageHeader
        title="MISs"
        buttonLabel="Add MIS"
        buttonLink="/miss/create"
      />

      <Results />

      <Outlet />
    </>
  )
}

export default MISs;