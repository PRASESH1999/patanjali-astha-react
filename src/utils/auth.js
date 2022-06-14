import { Navigate } from "react-router-dom";
import Status403 from "src/content/pages/Status/Status403";

export const hasRole = (roles) =>{
  if(localStorage.Role){
    return roles.includes(localStorage.Role);
  }
  return false;
}

export const hasRights = (roles, Component) => {
  if(localStorage.Role){
    if(roles.includes(localStorage.Role)){
      return <Component />
    }

    return <Status403 />;
  }
  return <Navigate to="/logout" />
}
  