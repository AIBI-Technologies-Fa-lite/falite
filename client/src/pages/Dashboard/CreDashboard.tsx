import InfoCard from "@components/InfoCard";
const CreDashboard = () => {
  return (
    <div className="flex flex-col w-full gap-10 md:flex-row">
      <div className="flex flex-col flex-1 gap-6">
        <div>
          <h2 className="mb-4 text-xl font-bold">Monthly</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoCard title="Total" value={12} bgColor="bg-blue-100" textColor="text-blue-600" onClick={() => console.log()} />
            <InfoCard title="Completed" value={10} bgColor="bg-green-100" textColor="text-green-600" onClick={() => console.log()} />
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold">Daily</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <InfoCard title="Pending" value={5} bgColor="bg-red-100" textColor="text-red-600" onClick={() => console.log()} />
            <InfoCard title="Closed" value={4} bgColor="bg-green-100" textColor="text-green-600" onClick={() => console.log()} />
            <InfoCard title="Total" value={12} bgColor="bg-blue-100" textColor="text-blue-600" onClick={() => console.log()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreDashboard;
