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
const ImportCsv = Loader(lazy(() => import('src/content/imports/ImportCsv')));
const ImportCsvAdvanced = Loader(lazy(() => import('src/content/imports/ImportCsvAdvanced')));
const Imports = Loader(lazy(() => import('src/content/imports')));
const ShowImport = Loader(lazy(() => import('src/content/imports/popups/Item')));

const importRoutes = [

  // Attendance
  {
    path: '/imports',
    element: hasRights(['admin', 'mis'], Imports),
    children: [
      {
        path: '/imports/:id',
        element: hasRights(['admin', 'mis'], ShowImport)
      },
    ]
  },
  {
    path: '/import-csv',
    element: hasRights(['admin', 'mis'], ImportCsv)
  },
  {
    path: '/import-csv-advanced',
    element: hasRights(['admin', 'mis'], ImportCsvAdvanced)
  },
];

export default importRoutes;
