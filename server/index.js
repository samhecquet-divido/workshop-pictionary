const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // Join a room
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on("new_message", (data) => {
    console.log("new_message");
    io.in(roomId).emit("new_message", data);
  });

  socket.on("get_rooms", () => {
    let keys = [...io.sockets.adapter.rooms.keys()];
    const rooms = keys.filter((room) => room);
    io.emit("receive_rooms", rooms);
  });

  // drawing
  socket.on("get_coord", (data) => {
    io.emit("get_coord", data);
  });
  socket.on("draw_coord", (data) => {
    socket.broadcast.emit("receive_coord", data);
  });

  // interactions
  socket.on("send_im_owner", (data) => {
    console.log("send_im_owner", { data });
    socket.broadcast.emit("receive_im_owner", data);
  });

  socket.on("send_good_solution", (data) => {
    console.log("send_good_solution", { data });
    socket.broadcast.emit("receive_good_solution", data);
  });

  socket.on("send_game_started", (data) => {
    console.log("send_game_started", { data });
    socket.broadcast.emit("receive_game_started", data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
    // TODO: shut down room if empty
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
