import { combineReducers } from 'redux';

// Catalog
// import { reducer as divisionReducer} from 'src/slices/division';
// import { reducer as verticalReducer } from 'src/slices/vertical';
// import { reducer as brandReducer } from 'src/slices/brand';
// import { reducer as unitReducer } from 'src/slices/unit';
// import { reducer as productReducer } from 'src/slices/product';

import { reducer as dashboardReducer } from 'src/slices/dashboard';

import { reducer as routeReducer } from 'src/slices/route';

// User
import { reducer as allUserReducer } from 'src/slices/allUser';
import { reducer as adminReducer } from 'src/slices/admin';
import { reducer as misReducer } from 'src/slices/mis';
import { reducer as shReducer } from 'src/slices/sh';
import { reducer as ashReducer } from 'src/slices/ash';
import { reducer as aseReducer } from 'src/slices/ase';
import { reducer as soReducer } from 'src/slices/so';

import { reducer as regionReducer } from 'src/slices/region'
import { reducer as stateReducer } from 'src/slices/state';
import { reducer as districtReducer } from 'src/slices/district'
import { reducer as pinCodeReducer } from 'src/slices/pinCode'
import { reducer as cityReducer } from 'src/slices/city'

import { reducer as attendanceReducer } from 'src/slices/attendance';
import { reducer as importReducer } from 'src/slices/import';

import { reducer as geolocationReducer } from 'src/slices/geolocation'

import { reducer as currentLocationReducer } from 'src/slices/currentLocation'

const rootReducer = combineReducers({

  dashboard: dashboardReducer,

  route: routeReducer,

  // User
  allUser: allUserReducer,
  admin: adminReducer,
  mis: misReducer,
  sh: shReducer,
  ash: ashReducer,
  ase: aseReducer,
  so: soReducer,

  // location
  region: regionReducer,
  state: stateReducer,
  district: districtReducer,
  pinCode: pinCodeReducer,
  city: cityReducer,

  attendance: attendanceReducer,


  geolocaion: geolocationReducer,

  import: importReducer,

  currentLocation: currentLocationReducer,
});

export default rootReducer;
