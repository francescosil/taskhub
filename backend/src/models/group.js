const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: String,
  code: { type: String, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Group", GroupSchema);
