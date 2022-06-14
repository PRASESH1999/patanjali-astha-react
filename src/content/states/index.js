import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import PageHeader from 'src/components/PageHeader'
import Results from './blocks/Results'

function States() {

  return (
    <>
      <Helmet>
        <title>States</title>
      </Helmet>
      
      <PageHeader
        title="States"
        buttonLabel="Add State"
        buttonLink="/states/create"
      />

      <Results />

      <Outlet />
    </>
  )
}

export default States