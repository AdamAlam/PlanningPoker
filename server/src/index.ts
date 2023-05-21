const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const PORT = 8080;

const app = express();
app.use(cors());
const usersMap = {};

let pointsShown = false;

const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  cors: {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/userData", (req, res) => {
  res.send(Object.values(usersMap));
});

app.get("/users", (req, res) => {
  res.cookie("userName", "user's name", { maxAge: 30 * 60 * 1000 });
  res.send("User name is set in cookies");
});

const emitUserData = (socket) => {
  const userValues = Array.from(Object.values(usersMap));
  socket.broadcast.emit("receive_user_data_change", userValues);
  socket.emit("receive_user_data_change", userValues);
};

io.on("connection", (socket) => {
  console.log(`New client connected ${socket.id}`);

  socket.on("register", (name, points) => {
    console.log(`New user registered: ${name}`);
    usersMap[socket.id] = { name: name, points: points || undefined };
  });

  socket.on("readyForUpdates", () => {
    console.log("Received ready for updates");
    emitUserData(socket);
    socket.emit("receive_points_visibility", pointsShown);
  });

  socket.on("sent_message", (data) => {
    console.log(`Received message: ${data.message}`);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("send_points_change", (newPoints) => {
    usersMap[socket.id] = { ...usersMap[socket.id], points: newPoints };
    emitUserData(socket);
  });

  socket.on("change_points_shown", (data) => {
    console.log(`Received change to POINTS_SHOWN: ${data.pointsShown}`);
    pointsShown = data.pointsShown;
    socket.broadcast.emit("change_all_points_visibility", data);
  });

  socket.on("change_display_name", (newName) => {
    // usersMap[socket.id]["name"] = newName;
    usersMap[socket.id] = { ...usersMap[socket.id], name: newName };
    emitUserData(socket);
  });

  socket.on("clear_points", () => {
    Object.keys(usersMap).forEach(
      (key) => (usersMap[key]["points"] = undefined)
    );
    emitUserData(socket);
    io.emit("cleared_data", usersMap[socket.id]["name"]);
  });

  socket.on("disconnect", () => {
    delete usersMap[socket.id];
    console.log(`Client disconnected ${socket.id}`);
  });
});

httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
