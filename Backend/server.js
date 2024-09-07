const express = require("express");
const dotenv = require("dotenv");
const chats = require("./Data/data");
const connectDB = require("./config/db");
const UserRouter = require("./routes/userRoutes");
const { notFound } = require("./middleware/errorMiddleware");
const chatRouter = require('./routes/chatRoutes');
const messageRouter = require('./routes/messageRoutes');
const path = require("path");

const app = express();
const __dirnam = path.resolve();
dotenv.config();
connectDB();

app.use(express.json());


app.use("/api/user",UserRouter);
app.use("/api/chat",chatRouter);
app.use("/api/message",messageRouter);

// app.use(notFound);

app.use(express.static(path.join(__dirnam, "/frontend/build")));

app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirnam,"frontend","build","index.html"));
})

const PORT = process.env.PORT;
const server = app.listen(PORT, console.log(`Server has started on ${PORT}`));

const io = require('socket.io')(server,{
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  }
})

io.on("connection",(socket) => {
  console.log("connected to socket.io");

  socket.on('setup',(userData) => {
    socket.join(userData._id);
    socket.emit("conneted");
  })

  socket.on('join chat',(room)=>{
    console.log("user joined romm: " , room);
    socket.join(room);
  })

  socket.on("new message",(newMessageRecieved)=>{
    var chat = newMessageRecieved.chat;

    if(!chat.users) return console.log("caht.users ar not defined");

    chat.users.forEach(user=>{
      if(user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved",newMessageRecieved);
    })
  })
})
