import { io } from "socket.io-client";

const socket = io(
  // "http://localhost:5000" (Testing)
  "https://apms-backend-z5z0.onrender.com"
);

socket.on("connect", () => {
  console.log(
    "Socket Connected from socket.js:",
    socket.id
  );
});

export default socket;