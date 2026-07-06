const { Server } = require("socket.io");

let io;

const onlineUsers = {};

const initializeSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://apms-gamma.vercel.app",
      ],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    console.log(
      "User Connected:",
      socket.id
    );

    socket.on("register", (userId) => {

      onlineUsers[userId] = socket.id;

      console.log(
        "Registered:",
        userId,
        "->",
        socket.id
      );

    });

    socket.on("disconnect", () => {

      console.log(
        "User Disconnected:",
        socket.id
      );

      for (const userId in onlineUsers) {

        if (
          onlineUsers[userId] === socket.id
        ) {

          delete onlineUsers[userId];
          break;

        }

      }

    });

  });

};

module.exports = {
  initializeSocket,
  onlineUsers,
  getIO: () => io,
};