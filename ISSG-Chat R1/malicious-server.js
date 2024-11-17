const http = require("http");
const socketIo = require("socket.io");
const crypto = require("crypto");

const server = http.createServer();
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on("message", (data) => {
    let { username, message } = data;

    // Modify the message
    message = message + " (malicious edit)";

    // Send a fake or invalid hash (e.g., all zeros)
    const fakeHash = "0000000000000000000000000000000000000000000000000000000000000000";

    // Emit the modified message and fake hash
    io.emit("message", { username, message, hash: fakeHash });
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Malicious server running on port ${port}`);
});