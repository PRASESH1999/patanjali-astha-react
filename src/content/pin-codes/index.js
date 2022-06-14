import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import PageHeader from 'src/components/PageHeader'
import Results from './blocks/Results'

function PinCodes() {

  return (
    <>
      <Helmet>
        <title>Pin Codes</title>
      </Helmet>
      
      <PageHeader
        title="Pin Codes"
        buttonLabel="Add Pin Code"
        buttonLink="/pin-codes/create"
      />

      <Results />

      <Outlet />
    </>
  )
}

export default PinCodes