const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/tasks");

//intercetta GET /tasks per ottenere tasks
router.get("/", auth, async (req, res) => {
    const tasks = await Task.find({
    $or: [
      { userId: req.user.id },                    //tutte le tasks dell'utente + dei gruppi di cui è member (tasks dove userId==me OR groupId in groups)
      { groupId: { $exists: true, $ne: null } }
    ]
  });
  res.json(tasks);
});


//intercetta POST /tasks per inserire tasks
router.post("/", auth, async (req, res) => {
  try {
    const io = req.app.get("io");
    const { title, description, groupId, date, priority,comment } = req.body;

    const task = await Task.create({
      title,
      description,
      date,
      priority,                   
      comment,   
      completed: req.body.completed || false,
      userId: req.user.id,
      groupId: groupId || null
    });

    if (task.groupId) {
      io?.to(`group_${task.groupId}`).emit("task:new", task);
    } else {
      io?.to(`user_${req.user.id}`).emit("task:new", task);
    }

    res.json(task);
  } catch (err) {
    console.error("ERRORE CREAZIONE TASK:", err);
    res.status(500).json({ error: "Errore creazione task" });
  }
});



//intercetta PUT /tasks/:id per modificare task
router.put("/:id", auth, async (req, res) => {
  const io = req.app.get("io");
  const updates = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: "Task non trovata" });

  
  // blocco modifica se giorno diverso
  const today = new Date().toISOString().split("T")[0];

  const taskDay = new Date(task.date).toISOString().split("T")[0];

  if (taskDay !== today) {
    return res.status(403).json({ error: "Non puoi modificare task di altri giorni" });
  }


    Object.assign(task, updates);
    await task.save();

    if (task.groupId)
      io.to(`group_${task.groupId}`).emit("task:update", task);
    else
      io.to(`user_${req.user.id}`).emit("task:update", task);

    res.json(task);
});

//intercetta DELETE /tasks/:id per eliminare task
router.delete("/:id", auth, async (req, res) => {
  const io = req.app.get("io");
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ error: "Task non trovato" });

  if (task.groupId) {
    io?.to(`group_${task.groupId}`).emit("task:delete", { _id: task._id });
  } else {
    io?.to(`user_${req.user.id}`).emit("task:delete", { _id: task._id });
  }

  res.json({ success: true });
});

module.exports = router;
