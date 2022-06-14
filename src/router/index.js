import { Suspense, lazy } from 'react';

import Authenticated from 'src/components/Authenticated';
import SuspenseLoader from 'src/components/SuspenseLoader';
import Guest from 'src/components/Guest';

import BaseLayout from 'src/layouts/BaseLayout';
// import AccentSidebarLayout from 'src/layouts/AccentSidebarLayout';
import BoxedSidebarLayout from 'src/layouts/BoxedSidebarLayout';

import baseRoutes from './base';
import usersRoutes from './user';
import geolocationsRoutes from './geolocation';
import attendanceRoutes from './attendance';
import importRoutes from './import';
import currentLocationRoutes from './currentLocation'
import settingRoutes from './setting';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Account

const Login = Loader(
  lazy(() => import('src/content/pages/Auth/Login'))
);

const Dashboard = Loader(
  lazy(() => import('src/content/dashboard'))
);

const router = [

  {
    path: '*',
    element: <BaseLayout />,
    children: baseRoutes
  },
  {
    path: '/login',
    element: (
      <Guest>
        <BaseLayout>
          <Login />
        </BaseLayout>
      </Guest>
    ),
  },

  // Accent Header Layout
  {
    path: '',
    element: (
      <Authenticated>
        <BoxedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '',
        children: usersRoutes
      },
      {
        path: '',
        children: geolocationsRoutes
      },
      {
        path: '',
        children: attendanceRoutes
      },
      {
        path: '',
        children: importRoutes
      },
      {
        path: '',
        children: currentLocationRoutes
      },
      {
        path:'',
        children: settingRoutes     
      }
    ]
  },
];

export default router;
