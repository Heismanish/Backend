import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.io
io.on("connection", (socket) => {
//   console.log("A new user has been connected");
socket.on('user-message',(message)=>{
    // console.log("A new user message:",message)
    io.emit("message",message) // send this message to all the client including the sender.
})
});

app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  console.log("Home");
  return res.sendFile("/public/index.html");
});

server.listen(9000, () => console.log("Server is live at 9000"));
