const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const connectToDB = require("./config/db");
const userRoute = require("./routes/user.route");

const app = express();
const PORT = process.env.PORT_NUMBER || 3000;

// middleware
app.use(express.json());

app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("home page");
});

app.listen(PORT, async (req, res) => {
  try {
    await connectToDB();
    console.log(`listening on port ${PORT}`);
  } catch (error) {
    console.log("server is not running");
  }
});
