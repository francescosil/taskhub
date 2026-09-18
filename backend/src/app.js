const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

//middleware di rotte
app.use("/user", require("./controllers/userRoutes"));
app.use("/tasks", require("./controllers/taskRoutes"));
app.use("/groups", require("./controllers/groupRoutes"));

module.exports = app;


