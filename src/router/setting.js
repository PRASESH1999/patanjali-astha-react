import { Suspense, lazy } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { hasRights } from 'src/utils/auth';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// Regions
const RegionList = Loader(lazy(() => import('src/content/regions')));
const CreateRegion = Loader(lazy(() => import('src/content/regions/popups/Create')));
const ShowRegion = Loader(lazy(() => import('src/content/regions/popups/Item')));
const EditRegion = Loader(lazy(() => import('src/content/regions/popups/Edit')));

// States
const StateList = Loader(lazy(() => import('src/content/states')));
const CreateState = Loader(lazy(() => import('src/content/states/popups/Create')));
const ShowState = Loader(lazy(() => import('src/content/states/popups/Item')));
const EditState = Loader(lazy(() => import('src/content/states/popups/Edit')));

// Districts
const DistrictList = Loader(lazy(() => import('src/content/districts')));
const CreateDistrict = Loader(lazy(() => import('src/content/districts/popups/Create')));
const ShowDistrict = Loader(lazy(() => import('src/content/districts/popups/Item')));
const EditDistrict = Loader(lazy(() => import('src/content/districts/popups/Edit')));

// PinCodes
const PinCodeList = Loader(lazy(() => import('src/content/pin-codes')));
const CreatePinCode = Loader(lazy(() => import('src/content/pin-codes/popups/Create')));
const ShowPinCode = Loader(lazy(() => import('src/content/pin-codes/popups/Item')));
const EditPinCode = Loader(lazy(() => import('src/content/pin-codes/popups/Edit')));

// Cities
const CityList = Loader(lazy(() => import('src/content/cities')));
const CreateCity = Loader(lazy(() => import('src/content/cities/popups/Create')));
const ShowCity = Loader(lazy(() => import('src/content/cities/popups/Item')));
const EditCity = Loader(lazy(() => import('src/content/cities/popups/Edit')));


const usersRoutes = [

    // Regions
    {
      path: '/regions',
      element: hasRights(['admin'], RegionList),
      children: [
        {
          path: 'create',
          element: hasRights(['admin'], CreateRegion)
        },
        {
          path: ':id',
          element: hasRights(['admin'], ShowRegion)
        },
        {
          path: 'edit/:id',
          element: hasRights(['admin'], EditRegion)
        },
      ]
    },


  // SHs
  {
    path: '/states',
    element: hasRights(['admin', 'mis'], StateList),
    children: [
      {
        path: 'create',
        element: hasRights(['admin', 'mis'], CreateState)
      },
      {
        path: ':id',
        element: hasRights(['admin', 'mis'], ShowState)
      },
      {
        path: 'edit/:id',
        element: hasRights(['admin', 'mis'], EditState)
      },
    ]
  },
  
  // Districts
  {
    path: '/districts',
    element: hasRights(['admin'], DistrictList),
    children: [
      {
        path: 'create',
        element: hasRights(['admin'], CreateDistrict)
      },
      {
        path: ':id',
        element: hasRights(['admin'], ShowDistrict)
      },
      {
        path: 'edit/:id',
        element: hasRights(['admin'], EditDistrict)
      },
    ]
  },
  
  // PinCodes
  {
    path: '/pin-codes',
    element: hasRights(['admin'], PinCodeList),
    children: [
      {
        path: 'create',
        element: hasRights(['admin'], CreatePinCode)
      },
      {
        path: ':id',
        element: hasRights(['admin'], ShowPinCode)
      },
      {
        path: 'edit/:id',
        element: hasRights(['admin'], EditPinCode)
      },
    ]
  },
  
  // Citys
  {
    path: '/cities',
    element: hasRights(['admin'], CityList),
    children: [
      {
        path: 'create',
        element: hasRights(['admin'], CreateCity)
      },
      {
        path: ':id',
        element: hasRights(['admin'], ShowCity)
      },
      {
        path: 'edit/:id',
        element: hasRights(['admin'], EditCity)
      },
    ]
  },
];

export default usersRoutes;
