import MapIcon from '@mui/icons-material/Map';
import { hasRole } from 'src/utils/auth';

const locationTrackingItems = {
  name: 'Location Tracking',
  icon: MapIcon,
  items: []
};

if(hasRole(['admin', 'sub-admin', 'demand-mis', 'mis', 'vp', 'rm', 'gm', 'asm', 'sso', 'so'])) {
  locationTrackingItems.items.push(
    {
      name: 'Map',
      link: '/map'
    }
    )
} 

if(hasRole(['admin'])) {
  locationTrackingItems.items.push(
    {
      name: 'Current Locations',
      link: '/current-locations'
    }
    )
}

if(hasRole(['admin', 'sub-admin', 'demand-mis', 'mis'])) {
  locationTrackingItems.items.push(
    {
      name: 'Attendance',
      link: '/attendances'
    }
  )
}

export default locationTrackingItems;