import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import PageHeader from 'src/components/PageHeader'
import Results from './blocks/Results'

function Cities() {

  return (
    <>
      <Helmet>
        <title>Cities</title>
      </Helmet>
      
      <PageHeader
        title="Cities"
        buttonLabel="Add Citie"
        buttonLink="/cities/create"
      />

      <Results />

      <Outlet />
    </>
  )
}

export default Cities