import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

import { useEffect } from "react";
import socket from "./socket";
import NotificationListener from "./components/NotificationListener";

function App() {

  useEffect(() => {

    socket.on("connect", () => {

      console.log(
        "Socket Connected:",
        socket.id
      );

    });

    return () => {

      socket.off("connect");

    };

  }, []);

  return (
    <BrowserRouter>
      <NotificationListener />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;