import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Inbox } from "lucide-react";
import { api } from "../../services/api";
import Dropdown, { DropdownDivider } from "../ui/Dropdown";
import Skeleton from "../ui/Skeleton";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export default function NotificationDropdown() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications using TanStack Query
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get("/notifications");
      return response.data;
    },
    enabled: isAuthenticated, // Only fetch when logged in
  });

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark all as read mutation (simulated since backend endpoint may not exist, but let's check profile / reviews updates)
  // Let's create a mutation that marks all query cache items as read or hits the put endpoint if backend supports it.
  // Wait, let's keep it safe. If backend doesn't support marking as read, we can still perform cache updating.
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      // If backend has a mark-read endpoint, call it. If not, just mock the client-side state.
      // Let's check if the backend has notifications routes updates, but it doesn't seem to have one in server.js/notificationRoutes.js.
      // Let's check notificationRoutes.js: it only has router.get("/", protect, getNotifications);
      // Therefore, we can just update the Query Client cache!
      return true;
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (old) => {
        if (!old) return [];
        return old.map((n) => ({ ...n, isRead: true }));
      });
    },
  });

  const trigger = (
    <button className="relative p-2.5 rounded-lg bg-white/5 border border-border-glass text-gray-400 hover:text-white hover:border-indigo-500/30 transition-all cursor-pointer">
      <Bell size={16} />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 shadow-neon-accent"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
        </span>
      )}
    </button>
  );

  return (
    <Dropdown trigger={trigger} align="right" className="w-80">
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-sm font-bold text-white">Notifications</span>
        {unreadCount > 0 && (
          <button
            onClick={() => markAsReadMutation.mutate()}
            className="flex items-center gap-1 text-[10px] uppercase font-bold text-accent hover:text-white transition-colors cursor-pointer"
          >
            <Check size={12} />
            Mark all read
          </button>
        )}
      </div>
      <DropdownDivider />

      <div className="max-h-64 overflow-y-auto px-1 py-1 space-y-1">
        {isLoading ? (
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-3/4" />
            <DropdownDivider />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <Inbox size={24} className="text-gray-600 mb-2" />
            <p className="text-xs text-gray-400 font-light">Inbox is clear</p>
            <p className="text-[10px] text-gray-500 font-light mt-0.5">
              We'll notify you of update requests.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={cn(
                "p-3 rounded-md transition-colors text-left flex gap-2.5 items-start",
                notification.isRead 
                  ? "bg-transparent text-gray-400" 
                  : "bg-primary/5 text-gray-200 border border-primary/10"
              )}
            >
              {!notification.isRead && (
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shadow-neon-primary flex-shrink-0" />
              )}
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-semibold text-white leading-normal">
                  {notification.title}
                </p>
                <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                  {notification.message}
                </p>
                <p className="text-[9px] text-gray-500 font-light">
                  {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Dropdown>
  );
}
