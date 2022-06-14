import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';
// import { hasRights } from 'src/utils/auth';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

const Dashboard = Loader(lazy(() => import('src/content/dashboard/dashboard')));

const DashboardRoutes = [
  {
    path: '/dashboard',
    element: Dashboard
  }
];

export default DashboardRoutes;
