const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../model/user.model");
const auth = require("../middleware/auth.middleware");
const userRoute = express.Router();

userRoute.post("/register", async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // Check for missing or empty fields
    if (!username || !password || !email) {
      return res
        .status(400)
        .send("All fields are required: username, password, email, role.");
    }

    const user = await UserModel.findOne({ username });

    // Check user is present
    if (user) {
      return res.status(500).send("user is already registered login plase");
    }

    bcrypt.hash(password, 4, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return res.status(400).send("Password encryption failed.");
      }
      const newuser = await new UserModel({
        username,
        email,
        password: hash,
        role,
      });
      newuser.save();
      res.status(201).send("user registration successful");
    });
  } catch (error) {
    res.status(500).send(`Register failed: ${error.message}`);
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Please provide both email and password.");
    }

    const user = await UserModel.findOne({ email });
    // res.send(user);

    if (user) {
      bcrypt.compare(password, user.password).then(async (result) => {
        if (result) {
          jwt.sign(
            { username: user.username, role: user.role },
            process.env.SERETE_KEY,
            function (err, token) {
              if (err) {
                return res.status(500).send({
                  message: "Something went wrong while generating the token.",
                  err,
                });
              }

              res
                .status(200)
                .send({ message: "user logged in successfully", token });
            }
          );
        } else {
          res.status(401).send("The password you entered is incorrect.");
        }
      });
    } else {
      return res
        .status(404)
        .send("User not found. Please check your email and try again.");
    }
  } catch (error) {
    res.status(500).send(`Login failed: ${error.message}`);
  }
});

userRoute.get("/home", auth, (req, res) => {
  try {
    res.status(200).send({
      message: "Welcome to the home route",
      name: req.username,
      role: req.role,
    });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

module.exports = userRoute;
