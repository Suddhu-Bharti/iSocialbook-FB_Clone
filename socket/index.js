const io = require("socket.io")(9000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("A user connected.");
  //send welcome msg to client
  io.emit("welcome", "Hello! Welcome to socket server.");

  //take userId and socketId from client
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getOnlineUsers", users);
    // console.log(users);
  });

  //get and send new message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //get and send new conversation
  socket.on("sendNewConversation", ({data, receiverId}) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getNewConversation", data);
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("Someone disconnected.");
    removeUser(socket.id);
    io.emit("getOnlineUsers", users);
    // console.log(users);
  });
});
