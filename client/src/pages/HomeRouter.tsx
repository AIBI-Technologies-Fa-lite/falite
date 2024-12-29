import { selectUser } from "@providers/authSlice";
import { useSelector } from "react-redux";
import FieldDashboard from "./Dashboard/MainDashboard";
import CreDashboard from "./Dashboard/CreDashboard";
import DirectorDashboard from "./Dashboard/DirectorDashboard";
import { useEndDayMutation } from "@api/locationApi";
import { toast } from "react-toastify";

const HomeRouter = () => {
  const [end] = useEndDayMutation();
  const endDay = async () => {
    try {
      await end({}).unwrap();
      toast.success("Location Reset");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to update Location");
    }
  };
  const user = useSelector(selectUser);
  if (user?.role === "OF" || user?.role === "SUPERVISOR") {
    return <FieldDashboard />;
  } else if (user?.role === "DIRECTOR") {
    return <DirectorDashboard />;
  } else if (user?.role === "CRE") {
    return <CreDashboard />;
  } else
    return (
      <button
        className='w-full px-4 py-2 text-xs text-white bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto mb-2'
        onClick={endDay}
      >
        End Day
      </button>
    );
};

export default HomeRouter;
