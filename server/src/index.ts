// import cors from "cors";
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const PORT = 8080;

const app = express();
app.use(cors);

const usersMap = {};

const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  // TODO: Add correct origin
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.get("/userData", (req, res) => {
  res.send(Object.values(usersMap));
});

io.on("connection", (socket) => {
  console.log(`New client connected ${socket.id}}`);

  socket.on("register", (name, points) => {
    console.log(`New user registered: ${name}`);
    usersMap[socket.id] = { name: name, points: points || undefined };
  });

  socket.on("readyForUpdates", () => {
    console.log("received ready for updates");

    const userValues = Array.from(Object.values(usersMap));
    socket.broadcast.emit("receive_user_data_change", userValues);
    socket.emit("receive_user_data_change", userValues);
    console.log("Sent User Data", userValues);
  });

  socket.on("sent_message", (data) => {
    console.log(`Received message: ${data.message}`);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("send_points_change", (newPoints) => {
    usersMap[socket.id] = { ...usersMap[socket.id], points: newPoints };
    console.log(Object.values(usersMap));
    socket.broadcast.emit("receive_user_data_change", Object.values(usersMap));
  });

  socket.on("change_points_shown", (data) => {
    console.log(`Received change to POINTS_SHOWN: ${data.pointsShown}`);
    socket.broadcast.emit("change_all_points_visibility", data);
  });

  socket.on("disconnect", () => {
    delete usersMap[socket.id];
    console.log(`client disconnected ${socket.id}`);
  });
});

httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
