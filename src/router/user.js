import { Suspense, lazy } from 'react';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { hasRights } from 'src/utils/auth';

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

// ActiveUsers and PunchedInUsers
const ActiveUsers = Loader(lazy(() => import('src/content/all-users/ActiveUsersResults')));
const PunchedInUsers = Loader(lazy(() => import('src/content/all-users/PunchedInUsersResults')));
const PresentUsers = Loader(lazy(() => import('src/content/all-users/PresentUsersResults')));

// Admins
const AdminList = Loader(lazy(() => import('src/content/admins')));
const CreateAdmin = Loader(lazy(() => import('src/content/admins/popups/Create')));
const ShowAdmin = Loader(lazy(() => import('src/content/admins/popups/Item')));
const EditAdmin = Loader(lazy(() => import('src/content/admins/popups/Edit')));

// MISs
const MisList = Loader(lazy(() => import('src/content/miss')));
const CreateMis = Loader(lazy(() => import('src/content/miss/popups/Create')));
const ShowMis = Loader(lazy(() => import('src/content/miss/popups/Item')));
const EditMis = Loader(lazy(() => import('src/content/miss/popups/Edit')));

// SHs
const ShList = Loader(lazy(() => import('src/content/shs')));
const CreateSh = Loader(lazy(() => import('src/content/shs/popups/Create')));
const ShowSh = Loader(lazy(() => import('src/content/shs/popups/Item')));
const EditSh = Loader(lazy(() => import('src/content/shs/popups/Edit')));

// Ashs
const AshList = Loader(lazy(() => import('src/content/ashs')));
const CreateAsh = Loader(lazy(() => import('src/content/ashs/popups/Create')));
const ShowAsh = Loader(lazy(() => import('src/content/ashs/popups/Item')));
const EditAsh = Loader(lazy(() => import('src/content/ashs/popups/Edit')));

// Ashs
const AseList = Loader(lazy(() => import('src/content/ases')));
const CreateAse = Loader(lazy(() => import('src/content/ases/popups/Create')));
const ShowAse = Loader(lazy(() => import('src/content/ases/popups/Item')));
const EditAse = Loader(lazy(() => import('src/content/ases/popups/Edit')));

// SOs
const SoList = Loader(lazy(() => import('src/content/sos')));
const CreateSo = Loader(lazy(() => import('src/content/sos/popups/Create')));
const ShowSo = Loader(lazy(() => import('src/content/sos/popups/Item')));
const EditSo = Loader(lazy(() => import('src/content/sos/popups/Edit')));

const usersRoutes = [

  // Active Users and Punched In Users
  {
    path: '/active-users',
    element: <ActiveUsers />
  },

  {
    path: '/punched-in-users',
    element: <PunchedInUsers />
  },

  {
    path: '/present-users',
    element: <PresentUsers />
  },

  // Admins
  {
    path: '/admins',
    element: hasRights(['admin'], AdminList),
    children: [
      {
        path: 'create',
        element: hasRights(['admin'], CreateAdmin)
      },
      {
        path: ':id',
        element: hasRights(['admin'], ShowAdmin)
      },
      {
        path: 'edit/:id',
        element: hasRights(['admin'], EditAdmin)
      },
    ]
  },

  // MISs
  {
    path: '/miss',
    element: hasRights(['admin'], MisList),
    children: [
      {
        path: 'create',
        element: hasRights(['admin'], CreateMis)
      },
      {
        path: ':id',
        element: hasRights(['admin'], ShowMis)
      },
      {
        path: 'edit/:id',
        element: hasRights(['admin'], EditMis)
      },
    ]
  },

  // SHs
  {
    path: '/shs',
    element: hasRights(['admin', 'mis'], ShList),
    children: [
      {
        path: 'create',
        element: hasRights(['admin', 'mis'], CreateSh)
      },
      {
        path: ':id',
        element: hasRights(['admin', 'mis'], ShowSh)
      },
      {
        path: 'edit/:id',
        element: hasRights(['admin', 'mis'], EditSh)
      },
    ]
  },

  // ASHs
  {
    path: '/ashs',
    element: hasRights(['admin', 'mis', 'sh'], AshList),
    children: [
      {
        path: 'create',
        element: hasRights(['admin', 'mis', 'sh'], CreateAsh)
      },
      {
        path: ':id',
        element: hasRights(['admin', 'mis', 'sh'], ShowAsh)
      },
      {
        path: 'edit/:id',
        element: hasRights(['admin', 'mis', 'sh'], EditAsh)
      },
    ]
  },

  // ASEs
  {
    path: '/ases',
    element: hasRights(['admin', 'mis', 'sh', 'ash'], AseList),
    children: [
      {
        path: 'create',
        element: hasRights(['admin', 'mis', 'sh', 'ash'], CreateAse)
      },
      {
        path: ':id',
        element: hasRights(['admin', 'mis', 'sh', 'ash'], ShowAse)
      },
      {
        path: 'edit/:id',
        element: hasRights(['admin', 'mis', 'sh', 'ash'], EditAse)
      },
    ]
  },

  // SOs
  {
    path: '/sos',
    element: hasRights(['admin', 'mis', 'sh', 'ash', 'ase'], SoList),
    children: [
      {
        path: 'create',
        element: hasRights(['admin', 'mis', 'sh', 'ash', 'ase'], CreateSo)
      },
      {
        path: ':id',
        element: hasRights(['admin', 'mis', 'sh', 'ash', 'ase'], ShowSo)
      },
      {
        path: 'edit/:id',
        element: hasRights(['admin', 'mis', 'sh', 'ash', 'ase'], EditSo)
      },
    ]
  },
  
];

export default usersRoutes;
