import { Server } from "socket.io";
import { Socket } from "socket.io";

const socketIO = new Server(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users: any[] = [];

const addUser = (userId: any, socketId: any) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: any) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: any) => {
  return users.find((user) => user.userId === userId);
};

function socketController() {
  socketIO.on("connection", (socket: Socket) => {

    socket.on("addUser", (userId:string) => {
      addUser(userId, socket.id);
      socket.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ conversation_id, senderId, receiverId, text }) => {
      const user = getUser(receiverId);
     
      if(user?.socketId){
         socket.to(user.socketId).emit("getMessage", {
           conversation_id,
           senderId,
           text,
         });
      };
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
    });
  });
};

export default socketController;