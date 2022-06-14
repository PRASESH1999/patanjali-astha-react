import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';

const Guest = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { state } = useLocation();

  if (isAuthenticated) {
    window.location.replace(`${process.env.PUBLIC_URL}${state?.redirecTo || '/'}`)
  }

  return <>{children}</>;
};

Guest.propTypes = {
  children: PropTypes.node
};

export default Guest;
