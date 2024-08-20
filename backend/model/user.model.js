const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: { required: true, unique: true, type: String },
    email: { required: true, type: String },
    password: { required: true, type: String },
    role: {
      required: true,
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
