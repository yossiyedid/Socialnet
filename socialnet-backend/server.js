const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
//const logger = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());

const dbConfig = require("./config/secret");

const server =require('http').createServer(app);
const io =require('socket.io').listen(server);

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept, Authorization, Origin"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
//app.use(logger("dev"));

mongoose.Promise = global.Promise;
mongoose.connect(
  dbConfig.url,
  { useNewUrlParser: true }
);

require('./socket/streams')(io);

const auth = require("./routes/authRoutes");
const posts = require("./routes/postRoutes");
const users = require("./routes/userRoutes");
const friends = require("./routes/friendsRoutes");
const message = require("./routes/messageRoutes");

app.use("/api/socialnet", auth);
app.use("/api/socialnet", posts);
app.use("/api/socialnet", users);
app.use("/api/socialnet", friends);
app.use("/api/socialnet", message);

server.listen(3000, () => {
  console.log("Running on port 3000");
});
