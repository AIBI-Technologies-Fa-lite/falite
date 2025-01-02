import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";
import { useReportingQuery } from "@api/reportingApi";

const DirectorDashboard = () => {
  const [timeRange, setTimeRange] = useState("this-month"); // Default time range
  const {
    data: reports,
    isError,
    isLoading
  } = useReportingQuery({ timeRange }); // API call
  const [currentData, setCurrentData] = useState<any>(null); // State to store dashboard data

  useEffect(() => {
    if (!isLoading && reports) {
      setCurrentData(reports.data.data); // Set the API data to state
    }
  }, [reports, timeRange, isLoading, isError]);

  const chartData = {
    labels: currentData?.labels, // Use labels from API or fallback
    datasets: [
      {
        label: "Total Assigned",
        data: currentData?.totalAssigned, // Assigned data
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true
      },
      {
        label: "Total Completed",
        data: currentData?.totalCompleted, // Completed data
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: true
      }
    ]
  };

  return (
    <div className='container mx-auto p-6 grid grid-cols-6 gap-6'>
      {/* Top Cards */}
      <div className='grid grid-cols-3 gap-6 col-span-6'>
        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-sm text-gray-500'>Positive Outcomes</h2>
          <p className='text-2xl font-bold'>{currentData?.positive || 0}</p>
          <p className='text-sm text-gray-400'>
            {timeRange === "daily"
              ? "Today"
              : timeRange === "this-month"
              ? "This Month"
              : "Monthly"}
          </p>
        </div>

        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-sm text-gray-500'>Negative Outcomes</h2>
          <p className='text-2xl font-bold'>{currentData?.negative || 0}</p>
          <p className='text-sm text-gray-400'>
            {timeRange === "daily"
              ? "Today"
              : timeRange === "this-month"
              ? "This Month"
              : "Monthly"}
          </p>
        </div>

        <div className='bg-white p-4 rounded shadow'>
          <h2 className='text-sm text-gray-500'>Conversion</h2>
          <p className='text-2xl font-bold'>
            {currentData?.positive && currentData.negative
              ? (currentData.positive /
                  (currentData.negative + currentData.positive)) *
                100
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className='bg-white p-6 rounded shadow col-span-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-bold'>Analytics</h2>
          <div className='space-x-2'>
            {/* Time Range Buttons */}
            <button
              onClick={() => setTimeRange("daily")}
              className={`px-4 py-2 rounded ${
                timeRange === "daily"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeRange("this-month")}
              className={`px-4 py-2 rounded ${
                timeRange === "this-month"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeRange("monthly")}
              className={`px-4 py-2 rounded ${
                timeRange === "monthly"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DirectorDashboard;
