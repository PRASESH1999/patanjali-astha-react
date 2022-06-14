import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import PageHeader from 'src/components/PageHeader';
import Results from './blocks/Results';

function Admins() {
  return (
    <>
      <Helmet>
        <title>Admins</title>
      </Helmet>
      
      <PageHeader
        title="Admins"
        buttonLabel="Add Admin"
        buttonLink="/admins/create"
      />

      <Results />

      <Outlet />
    </>
  )
}

export default Admins