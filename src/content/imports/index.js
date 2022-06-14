import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import PageHeader from 'src/components/PageHeader'
import Results from './blocks/Results'

function Imports() {

  return (
    <>
      <Helmet>
        <title>Imports</title>
      </Helmet>
      
      <PageHeader
        title="Imports"
        disableButton
      />

      <Results />

      <Outlet />
    </>
  )
}

export default Imports;