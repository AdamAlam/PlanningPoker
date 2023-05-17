// import cors from "cors";
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const PORT = 8080;

const app = express();
app.use(cors);

const httpServer = http.createServer(app);
const io = socketIo(httpServer, {
  // TODO: Add correct origin
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}}`);

  socket.on("sent_message", (data) => {
    console.log(`Received message: ${data.message}`);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
