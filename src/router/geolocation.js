import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';
import { hasRights } from 'src/utils/auth';

const Loader = (Component) => (props) => 
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props}/>
  </Suspense>
);

// State
const Geolocation = Loader(lazy(() => import('src/content/map')));


const geolocationsRoutes = [
  {
    path: '/map',
    element: hasRights(['admin', 'sub-admin', 'demand-mis', 'mis', 'vp', 'rm', 'gm', 'asm', 'sso'], Geolocation)
  }
];

export default geolocationsRoutes;

