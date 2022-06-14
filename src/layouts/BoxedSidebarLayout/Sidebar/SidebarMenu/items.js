import DashboardIcon from '@mui/icons-material/Dashboard';

import { hasRole } from 'src/utils/auth';

import userItems from './items/userItems';
import locationTrackingItems from './items/locationTrackingItems';
import importItems from './items/importItems';
import settingItems from './items/settingItems';

const menuItems = [
  {
    heading: 'Menu',
    items: [
      {
        name: 'Dashboard',
        icon: DashboardIcon,
        link: '/'
      }
    ]
  }
];

if (hasRole(['admin', 'mis'])) {
  menuItems[0].items.push(importItems)
};

if(hasRole(['admin', 'mis', 'sh', 'ash', 'ase', 'so'])){
  menuItems[0].items.push(locationTrackingItems)
};

if (hasRole(['admin', 'mis', 'sh', 'ash', 'ase', 'so'])) {
  menuItems[0].items.push(userItems)
};

if (hasRole(['admin', 'mis'])){
  menuItems[0].items.push(settingItems);
};

export default menuItems;
