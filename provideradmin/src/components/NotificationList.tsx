import { cn } from "@/lib/utils";
import type { Notification } from "@/types";
import { getNotificationStyles } from "@/utils/NotificationStyler";

interface NotificationListProps {
  notification: Notification[];
}

const NotificationList = ({ notification }: NotificationListProps) => {
  return (
    <div className=" divide">
      {notification.map((notif) => {
        const style = getNotificationStyles[notif.type];
        const Icon = style.icon;
        return (
          <div key={notif.type} className=" flex gap-4 items-center border-y border-gray-100  py-3">
            <div className={cn(" px-3 py-2 rounded-md", style.bgColor)}>
              <Icon className={cn(style.iconColor, "size-5")} />
            </div>
            <div className=" flex-1 flex items-center justify-between">
                <div className=" flex flex-col justify-center gap-0.5">
                    <h2 className=" text-gray-900 text-sm md:text-base md:w-60">{notif.title}</h2>
                    <p className=" text-gray-400 text-xs md:text-sm">{notif.description}</p>
                </div>
                <p className=" text-gray-500 text-xs md:text-sm">{notif.timeAgo}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationList;
