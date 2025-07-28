import { type ReactNode, useRef, useState } from "react";
import {
  NotificationContext,
  type NotificationData,
} from "./NotificationContextDef.tsx";
import { Check, X } from "lucide-react";

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notificationData, setNotificationData] = useState<NotificationData>({
    type: "error",
    text: "Notification text not set",
  });
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // very helpful: https://stackoverflow.com/a/45036752
  const resetAnimation = () => {
    const element = document.getElementById("notification");
    if (element) {
      element.style.animation = "none";
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      element.offsetHeight; // triggers reflow (https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
      element.style.animation = "";
    }
  };

  const setNotification = (notification: NotificationData) => {
    clearTimeout(timeoutRef.current);

    resetAnimation();
    setNotificationData(notification);
    setIsVisible(true);

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2650);
  };

  return (
    <NotificationContext.Provider value={setNotification}>
      {children}
      {isVisible && (
        <div className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-center">
          <div
            id="notification"
            className={`mb-8 flex h-fit w-fit items-center justify-center rounded-xl bg-white/10 p-4 ${notificationData.type === "error" ? "text-error" : "text-success"} animate-slide-in-out`}
          >
            {notificationData.type === "error" ? <X /> : <Check />}
            <span className="ml-2 text-base font-medium">
              {notificationData.text}
            </span>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
