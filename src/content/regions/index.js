import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import PageHeader from 'src/components/PageHeader';
import Results from './blocks/Results'

function Regions() {
    return(
        <>
            <Helmet>
                <title>
                    Regions
                </title>
            </Helmet>

            <PageHeader
                title="Regions"
                buttonLabel = 'Add Regions'
                buttonLink = '/regions/create'
            />

            <Results />

            <Outlet />
        </>
    )
}

export default Regions;