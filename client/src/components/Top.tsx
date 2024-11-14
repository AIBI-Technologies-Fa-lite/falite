import { useEffect, useState } from "react";
import { useGetNotificationsQuery } from "@api/notificationApi";
import { BiBell } from "react-icons/bi";
const Top = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data, error, isLoading } = useGetNotificationsQuery({});

  console.log(data, error, isLoading);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  const formattedTime = currentTime.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const formattedDay = currentTime.toLocaleDateString(undefined, { weekday: "long" });

  return (
    <div className="flex h-[80px] items-center justify-between mb-6">
      <div className="text-xl text-purple-900">{`${formattedDay}, ${formattedTime}`}</div>
      <BiBell className="" />
    </div>
  );
};

export default Top;
