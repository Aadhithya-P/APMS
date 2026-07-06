import { useEffect } from "react";
import { toast } from "react-toastify";

import socket from "../socket";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

function NotificationListener() {

  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {

    if (!user) return;

    socket.emit(
      "register",
      user.user.id
    );

    socket.on(
      "visitor-request",
      (data) => {

        addNotification({
          id: Date.now(),
          visitorName: data.visitorName,
          message: data.message,
          time: new Date().toLocaleTimeString(),
        });

        toast.info(data.message);

      }
    );

    return () => {

      socket.off("visitor-request");

    };

  }, [user]);

  return null;

}

export default NotificationListener;