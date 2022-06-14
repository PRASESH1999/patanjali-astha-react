import { Suspense, lazy } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { hasRights } from 'src/utils/auth';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Attendance
const attendance = Loader(lazy(() => import('src/content/attendances')));

const attendanceRoutes = [

  // Attendance
  {
    path: '/attendances',
    element: hasRights(['admin', 'mis', 'reporting-manager'], attendance)
  },
];

export default attendanceRoutes;
