const mongoose = require("mongoose");
module.exports = mongoose.model(
  "user",
  new mongoose.Schema({
    id: String,
    username: { type: String, default: null },
    gender: { type: String, default: null },
    likes: { type: Number, default: 0 },
    reported: { type: Number, default: 0 },
    aboutMe: { type: String, default: null },
    isBanned: { type: Boolean, default: false },
    isQueue: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isChat: { type: Boolean, default: false }
  })
);
