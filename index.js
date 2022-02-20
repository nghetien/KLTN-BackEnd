const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require('socket.io')

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

dotenv.config();
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/// Connect MongoDB
const mongoDb = require("./src/configs/db.config");
mongoDb.connect();

/// Set up router
const router = require("./src/routes/router");
app.use("/api", router); /// Mỗi khi vào /api
app.get("*", (req, res) => {
  res.status(404).json({
    status: false,
    message: "Page not found",
    data: null,
  });
});

/// Socket
const io = new Server(server);
const handleSocket = require("./src/socket/index");
handleSocket(io);

/// Run port
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
