const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database successfully");
  } catch (error) {
    console.log("database not connected");
  }
};

module.exports = connectToDB;
