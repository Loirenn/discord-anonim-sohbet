const mongoose = require("mongoose");
module.exports = mongoose.model(
  "chat",
  new mongoose.Schema({
    user1: { type: String, required: true },
    user2: { type: String, required: true },
    user1_channel: { type: String, required: true },
    user2_channel: { type: String, required: true },
    code: { type: String, required: true },
  })
);
