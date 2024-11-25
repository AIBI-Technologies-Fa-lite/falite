import { selectUser } from "@providers/authSlice";
import { useSelector } from "react-redux";
import FieldDashboard from "./Dashboard/FieldDashboard";
import CreDashboard from "./Dashboard/CreDashboard";
const HomeRouter = () => {
  const user = useSelector(selectUser);
  if (user?.role === "OF" || user?.role === "SUPERVISOR") {
    return <FieldDashboard />;
  } else if (user?.role === "CRE") {
    return <CreDashboard />;
  } else return <div>HomeRouter</div>;
};

export default HomeRouter;
