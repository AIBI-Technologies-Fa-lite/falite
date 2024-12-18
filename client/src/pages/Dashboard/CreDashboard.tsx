import InfoCard from "@components/InfoCard";
import { useGetCaseCountQuery } from "@api/reportingApi";
const CreDashboard = () => {
  const { data, isLoading } = useGetCaseCountQuery({});
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='flex flex-col w-full gap-10 md:flex-row'>
      <div className='flex flex-col flex-1 gap-6'>
        <div>
          <h2 className='mb-4 text-xl font-bold'>Month to Date</h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <InfoCard
              title='Total'
              value={data.data.monthly.totalCases}
              bgColor='bg-blue-100'
              textColor='text-blue-600'
              onClick={() => console.log()}
            />
            <InfoCard
              title='Completed'
              value={data.data.monthly.completedCases}
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
              value={data.data.daily.pendingCases}
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
    </div>
  );
};

export default CreDashboard;
