const mongoose = require("mongoose");
module.exports = mongoose.model(
  "queue",
  new mongoose.Schema({
    nickname: { type: String, required: true },
    discordID: { type: String, required: true },
    discordTag: { type: String, required: true },
  })
);
