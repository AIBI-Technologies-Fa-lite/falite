import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const LoginGuard = () => {
  // Using the RootState to ensure type safety
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default LoginGuard;
