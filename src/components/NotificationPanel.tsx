import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { getNotificationsByRecipientId, getUnreadNotificationCount } from "../services/notificationServices/NotificationServices";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { JwtPayload } from "../types/jwt";
import { IoNotificationsOutline } from "react-icons/io5";

interface Notification {
  id: string;
  message: string;
  type: string;
  eventType: string;
  senderId: number;
  recipientId: number;
  createdAt: string;
  notificationStatus: string;
  projectId: number | null;
  issueId: number | null;
  general: boolean;
}

export const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return;

      const decodedToken = jwtDecode<JwtPayload>(token);
      const userId = decodedToken.userId;

      const [notificationsData, unreadCountData] = await Promise.all([
        getNotificationsByRecipientId(userId),
        getUnreadNotificationCount(userId),
      ]);

      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error("Bildirimler alınırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Her 30 saniyede bir bildirimleri güncelle
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div
        className="cursor-pointer relative opacity-70 hover:opacity-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoNotificationsOutline size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute transform  -translate-y-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Bildirimler</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Bildirim bulunmuyor
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 ${
                    notification.notificationStatus === "UNREAD"
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(notification.createdAt), "d MMMM yyyy HH:mm", {
                      locale: tr,
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 