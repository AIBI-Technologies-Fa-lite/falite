import { selectUser, setWorking } from "@providers/authSlice";
import { useStartDayMutation } from "@api/locationApi";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
const FieldDashboard = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [start] = useStartDayMutation();
  const startDay = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await start({ lat: position.coords.latitude, long: position.coords.longitude }).unwrap();
          dispatch(setWorking());
          toast.success("Added Location");
        } catch (err) {
          console.error("Submit error:", err);
          toast.error("Failed to update Location");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to retrieve location. Please try again.");
      }
    );
  };
  return (
    <div>
      {!user?.working ? (
        <button className="w-full px-4 py-2 text-xs text-white bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto mb-8" onClick={startDay}>
          Start Day
        </button>
      ) : (
        <button className="w-full px-4 py-2 text-xs text-white bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto mb-8">End Day</button>
      )}
    </div>
  );
};

export default FieldDashboard;
