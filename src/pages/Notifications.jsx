/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config";
import { formateDate } from "../utils/formateDate";
import convertTime from "../utils/convertTime";
import {
  CheckCircle2,
  Bell,
  Clock,
  Calendar,
  CheckCheck,
  User,
  Scissors,
  Loader2
} from "lucide-react";

const Notifications = () => {
  const { user, token, refreshNotifications } = useAuth();

  const formatStartTime = (iso) => {
    try {
      const d = new Date(iso);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return convertTime(`${hh}:${mm}`);
    } catch {
      return '';
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user._id) return;

    // Fetching Notification from the backend
    const fetchNotifications = async () => {
      try {
        const params = new URLSearchParams({ status: 'all', page: '1', limit: '20' });
        const res = await fetch(`${BASE_URL}/notifications?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch notifications");

        const data = await res.json();
        const fetchedNotifications = Array.isArray(data?.data) ? data.data : [];
        setNotifications(fetchedNotifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to mark notification as read");

      // Update local state to reflect the change
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, notificationStatus: "read" }
            : notification
        )
      );

      // Refresh the unread count
      refreshNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await fetch(`${BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          notificationStatus: "read",
        }))
      );

      // Refresh the unread count
      refreshNotifications();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      // Optionally show an error message to the user
    }
  };

  // Mark all notifications as unread
  const markAllAsUnread = async () => {
    try {
      await fetch(`${BASE_URL}/notifications/unread-all`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          notificationStatus: "unread",
        }))
      );

      // Refresh the unread count
      refreshNotifications();
    } catch (err) {
      console.error("Error marking all notifications as unread:", err);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-100 flex items-center gap-2">
            <Bell className="text-blue-600 dark:text-blue-400" size={24} />
            Notifications
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Stay updated with your latest appointments and alerts.</p>
        </div>

        <div className="flex gap-2">
          {notifications.some(n => n.notificationStatus === "unread") && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-300 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all text-sm font-medium"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}

          {notifications.some(n => n.notificationStatus === "read") && (
            <button
              onClick={markAllAsUnread}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-300 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all text-sm font-medium"
            >
              <Bell size={16} />
              Mark all as unread
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
            Error: {error.message}
          </div>
        )}

        {!loading && !error && notifications.length > 0 ? (
          <ul className="space-y-3">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`relative group p-5 rounded-2xl border transition-all duration-200 ${notification.notificationStatus === "unread"
                  ? "bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-800 shadow-md shadow-blue-50 dark:shadow-blue-900/20"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-90 hover:opacity-100"
                  }`}
              >
                {/* Unread Indicator Dot */}
                {notification.notificationStatus === "unread" && (
                  <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></span>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-3 w-full">
                    {/* Customer & Service Info */}
                    <div>
                      <div className="flex items-center gap-2 text-slate-900 dark:text-gray-100 font-bold text-lg mb-1">
                        <User size={18} className="text-slate-400 dark:text-gray-500" />
                        {notification.customer?.name || "Unknown Customer"}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 text-sm font-medium bg-slate-100/50 dark:bg-slate-700/50 w-fit px-2 py-1 rounded-lg">
                        <Scissors size={14} />
                        {notification.service?.name
                          || (Array.isArray(notification.providerServices) && notification.providerServices.length > 0
                            ? notification.providerServices.map(ps => ps?.name).filter(Boolean).join(', ')
                            : "No service provided")}
                      </div>
                    </div>

                    {/* Meta Details Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400 dark:text-gray-500" />
                        <span>{formateDate(notification.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400 dark:text-gray-500" />
                        <span>{formatStartTime(notification.startTime)}</span>
                      </div>
                      <div className="col-span-2 text-xs text-slate-400 dark:text-gray-500 mt-1 pt-2 border-t border-slate-100/50 dark:border-slate-700">
                        Received: {formateDate(notification.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {notification.notificationStatus === "unread" && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="shrink-0 flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors mt-2 sm:mt-0"
                      title="Mark as read"
                    >
                      <CheckCircle2 size={16} />
                      Read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Bell className="text-slate-300 dark:text-gray-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100">All caught up!</h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">No new notifications at the moment.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Notifications;