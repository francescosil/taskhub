const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: false },
  sex: { type: String, enum: ["F", "M","Altro"], required: false},
  birthplace: { type: String, required: false }
});

module.exports = mongoose.model("User", UserSchema);
