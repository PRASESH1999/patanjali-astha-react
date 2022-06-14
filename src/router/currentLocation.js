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
const CurrentLocations = Loader(lazy(() => import('src/content/current-locations')));
const ExportToCsv = Loader(lazy(() => import('src/content/current-locations/popups/ExportToCsv')));

const attendanceRoutes = [
  {
    path: '/current-locations',
    element: hasRights(['admin'], CurrentLocations),
    children: [
      {
        path : 'export-csv',
        element : hasRights(['admin'], ExportToCsv)
      }
    ]
  }
];

export default attendanceRoutes;

