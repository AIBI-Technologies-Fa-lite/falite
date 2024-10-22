import { useEffect, useState } from "react";

const Top = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  const formattedTime = currentTime.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const formattedDay = currentTime.toLocaleDateString(undefined, { weekday: "long" });

  return (
    <div className="flex h-[80px] items-center mb-6">
      <div className="text-xl text-purple-900">{`${formattedDay}, ${formattedTime}`}</div>
    </div>
  );
};

export default Top;
