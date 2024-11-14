import { selectUser } from "@providers/authSlice";
import { useSelector } from "react-redux";
import FieldDashboard from "./Dashboard/FieldDashboard";
const HomeRouter = () => {
  const user = useSelector(selectUser);
  if (user?.role === "OF") {
    return <FieldDashboard />;
  } else return <div>HomeRouter</div>;
};

export default HomeRouter;
