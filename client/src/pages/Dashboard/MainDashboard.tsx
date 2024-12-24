import { selectUser, setWorking } from "@providers/authSlice";
import { useStartDayMutation } from "@api/locationApi";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useGetVerificationCountQuery } from "@api/reportingApi";
import InfoCard from "@components/InfoCard";
import { Role } from "@constants/enum";
const FieldDashboard = () => {
  const { data, isLoading } = useGetVerificationCountQuery({});
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [start] = useStartDayMutation();
  const startDay = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await start({
            lat: position.coords.latitude,
            long: position.coords.longitude
          }).unwrap();
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
    <div className='flex flex-col w-full gap-10 pb-4'>
      {user?.role == Role.OF && (
        <div>
          {!user?.working ? (
            <button
              className='w-full px-4 py-2 text-xs text-white bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto mb-2'
              onClick={startDay}
            >
              Start Day
            </button>
          ) : (
            <button className='w-full px-4 py-2 text-xs text-white bg-purple-600 rounded-lg hover:bg-purple-400 md:w-auto mb-2'>
              End Day
            </button>
          )}
        </div>
      )}

      {isLoading || !data ? (
        <div>Loading...</div>
      ) : (
        <div className='flex flex-col flex-1 gap-6'>
          <div>
            <h2 className='mb-4 text-xl font-bold'>Month To Date</h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <InfoCard
                title='Total'
                value={data.data.monthly.totalVerifications}
                bgColor='bg-blue-100'
                textColor='text-blue-600'
                onClick={() => console.log()}
              />
              <InfoCard
                title='Completed'
                value={data.data.monthly.completedVerifications}
                bgColor='bg-green-100'
                textColor='text-green-600'
                onClick={() => console.log()}
              />
            </div>
          </div>

          <div>
            <h2 className='mb-4 text-xl font-bold'>Daily</h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <InfoCard
                title='Pending'
                value={data.data.daily.pendingVerifications}
                bgColor='bg-red-100'
                textColor='text-red-600'
                onClick={() => console.log()}
              />
              <InfoCard
                title='Closed'
                value={data.data.daily.completedToday}
                bgColor='bg-green-100'
                textColor='text-green-600'
                onClick={() => console.log()}
              />
              <InfoCard
                title='Total'
                value={data.data.daily.assignedToday}
                bgColor='bg-blue-100'
                textColor='text-blue-600'
                onClick={() => console.log()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldDashboard;
