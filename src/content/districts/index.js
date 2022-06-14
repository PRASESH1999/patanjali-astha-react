import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import PageHeader from 'src/components/PageHeader'
import Results from './blocks/Results'

function Districts() {

  return (
    <>
      <Helmet>
        <title>Districts</title>
      </Helmet>
      
      <PageHeader
        title="Districts"
        buttonLabel="Add District"
        buttonLink="/districts/create"
      />

      <Results />

      <Outlet />
    </>
  )
}

export default Districts