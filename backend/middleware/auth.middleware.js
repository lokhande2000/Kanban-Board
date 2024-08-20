const express = require("express");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return res.status(401).send({ message: "token is required" });
  }

  jwt.verify(token, "masai", function (err, decoded) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    if (decoded) {
      (req.username = decoded.username), (req.role = decoded.role);
      next();
    }
  });
};

module.exports = auth;
