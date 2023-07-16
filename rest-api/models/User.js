const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, min: 3, max: 20 },
    email: { type: String, require: true, max: 50, unique: true },
    password: { type: String, require: true, min: 6 },
    profilePic: { type: String, default: "" },
    coverPic: { type: String, default: "" },
    followers: { type: Array, default: [] },
    followings: { type: Array, default: [] },
    desc: { type: String, max: 50, default: "" },
    city: { type: String, max: 50, default: "" },
    from: { type: String, max: 50, default: "" },
    relationship: { type: Number, enum: [1, 2, 3], default: 1 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
