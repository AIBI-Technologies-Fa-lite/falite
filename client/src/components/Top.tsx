import { useEffect, useState } from "react";
import { useGetNotificationsQuery, useReadNotificationMutation } from "@api/notificationApi";
import { BiBell } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Top = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  const { data, error, isLoading, refetch } = useGetNotificationsQuery({});
  const [readNotification] = useReadNotificationMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  const formattedTime = currentTime.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const formattedDay = currentTime.toLocaleDateString(undefined, { weekday: "long" });

  // Toggle notification visibility
  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
  };

  // Extract notifications data and count
  const notifications = data?.data.notifications || [];
  const notificationCount = data?.meta?.count || 0;

  // Handle marking notification as read and navigating
  const handleNotificationClick = async (notification) => {
    try {
      await readNotification({ id: notification.id }); // Mark notification as read
      refetch();
      if (notification.type === "VERIFICATION") {
        navigate(`/verification/${notification.linkTo}`);
      } else if (notification.type === "CASE") {
        navigate(`/case/${notification.linkTo}`);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="flex h-[80px] items-center justify-between mb-6 relative">
      {/* Date and Time Display */}
      <div className="text-xl text-purple-900">{`${formattedDay}, ${formattedTime}`}</div>

      {/* Notification Bell */}
      <div className="relative cursor-pointer" onClick={handleBellClick}>
        <BiBell className="cursor-pointer text-2xl" />

        {/* Notification Count Badge */}
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notificationCount}
          </span>
        )}

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 max-h-80 overflow-y-auto">
            {isLoading ? (
              <p className="text-gray-500">Loading notifications...</p>
            ) : error ? (
              <p className="text-red-500">Error loading notifications.</p>
            ) : notifications.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Notifications</h3>
                <ul>
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="mb-3 last:mb-0 border-b p-2 border-gray-100 bg-purple-100 rounded-md cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">No notifications</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Top;
