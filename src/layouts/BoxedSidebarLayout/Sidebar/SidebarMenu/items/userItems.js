import PeopleIcon from '@mui/icons-material/People';
import { hasRole } from 'src/utils/auth';

const userItems = {
  name: 'Users',
  icon: PeopleIcon,
  items: []
};
  
if(hasRole(['admin', 'mis', 'sh', 'ash', 'ase'])) {
  userItems.items.push(
    {
      name: 'SOs',
      link: '/sos'
    }
    )
}

if(hasRole(['admin', 'mis', 'sh', 'ash'])) {
  userItems.items.push(
    {
      name: 'ASEs',
      link: '/ases'
    }
  )
}

if(hasRole(['admin', 'mis', 'sh'])) {
  userItems.items.push(
    {
      name: 'ASHs',
      link: '/ashs'
    }
  )
}

if(hasRole(['admin', 'mis'])) {
  userItems.items.push(
    {
      name: 'SHs',
      link: '/shs'
    }
  )
}

if(hasRole(['admin'])){
  userItems.items.push(
    {
      name: 'MISs',
      link: '/miss'
    },
    {
      name: 'Admins',
      link: '/admins'
    },
  )
}











export default userItems;