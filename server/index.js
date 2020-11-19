const http = require("http");
const express = require("express");
const socketio = require("socket.io");
// const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

// app.use(cors());

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);
    // This is a message that only you are going to receive as an user

    socket.emit("message", {
      user: "admin",
      text: `Hi, ${user.name}, and welcome to the room ${user.room}`,
    });
    // This is a message that the whole room apart from the person receives

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} just joined the room. Say hello!`,
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    socket.join(user.room);

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });
    // io.to(user.room).emit("message", {
    //   room: user.room,
    //   users: getUsersInRoom(user.room),
    // });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User abandoned the session");
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} left the room`,
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
