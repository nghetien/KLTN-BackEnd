const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3000;
// const client = new OAuth2Client(process.env.CLIENT_ID);

dotenv.config();
app.use(morgan("combined")); /// Nhận biết reload lại trang
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

/// Run port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
