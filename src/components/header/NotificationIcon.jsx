import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BellIcon } from "lucide-react";
import { useEffect } from "react";

const NotificationIcon = () => {
  const { user, unreadCount, refreshNotifications } = useAuth();
  const isProvider = user && user.role === "provider";
  const navigate = useNavigate();

  useEffect(() => {
    if (isProvider && user?._id) {
      refreshNotifications(); // Initial fetch when component mounts
    }
  }, [isProvider, user?._id, refreshNotifications]);

  const handleIconClick = () => {
    navigate("/notifications");
  };

  // Color coding logic based on unread count
  const getBadgeColor = (count) => {
    if (count <= 0) return '';
    if (count <= 5) return 'bg-blue-500'; // 1-5: Blue
    if (count <= 10) return 'bg-orange-500'; // 6-10: Orange
    return 'bg-red-500'; // 11+: Red
  };

  return (
    isProvider && (
      <div className="relative cursor-pointer group" onClick={handleIconClick}>
        <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" />
        {unreadCount > 0 && (
          <>
            {/* Badge */}
            <span className={`absolute -top-1 -right-1 ${getBadgeColor(unreadCount)} text-white rounded-full text-xs min-w-[20px] h-5 flex items-center justify-center px-1 font-bold shadow-lg animate-fadeIn`}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
            {/* Pulse animation ring */}
            <span className={`absolute -top-1 -right-1 ${getBadgeColor(unreadCount)} rounded-full min-w-[20px] h-5 animate-ping opacity-75`}></span>
          </>
        )}
      </div>
    )
  );
};

export default NotificationIcon;