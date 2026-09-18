const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
  date: { type: Date, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  comment: { type: String, default: "" }
});

module.exports = mongoose.model("Task", TaskSchema);
