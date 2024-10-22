import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { Role } from "@constants/enum";
import { ReactNode } from "react";

//Fetch the current user role
const getUserRole = () => {
  return useSelector((state: RootState) => state.auth.user?.role);
};

type Props = {
  children: ReactNode;
  allowedRoles: [Role];
};

const RoleGuard = (props: Props) => {
  const userRole = getUserRole();
  // Check if loggedin
  if (userRole) {
    // Check if role is allowed
    if (props.allowedRoles.includes(userRole)) {
      return props.children;
    }
  }
  return <Navigate to="/" replace />;
};

export default RoleGuard;
