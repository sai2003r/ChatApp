const express = require("express");
const dotenv = require("dotenv");
const chats = require("./Data/data");
const connectDB = require("./config/db");
const UserRouter = require("./routes/userRoutes");
const { notFound } = require("./middleware/errorMiddleware");
const chatRouter = require('./routes/chatRoutes');
const messageRouter = require('./routes/messageRoutes');

const app = express();
dotenv.config();
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api/user",UserRouter);
app.use("/api/chat",chatRouter);
app.use("/api/message",messageRouter);

app.use(notFound);

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
    socket.json(userData._id);
    socket.emit("conneted");
  })
})
