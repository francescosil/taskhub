const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Group = require("../models/group");
const Task = require("../models/tasks");

//genera codice casuale breve per accedere agruppo
function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

//Crea gruppo, intercetta POST /groups/create
router.post("/create", auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Nome gruppo richiesto" });

    const code = genCode();
    const group = await Group.create({
      name,
      code,
      members: [req.user.id],
      createdBy: req.user.id
    });

    res.status(201).json(group); 
  } catch (err) {
    console.error("ERRORE CREATE GROUP:", err);
    res.status(500).json({ error: "Errore creazione gruppo" });
  }
});

//Join al gruppo con codice che intercetta POST /groups/join
router.post("/join", auth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Codice richiesto" });

    const group = await Group.findOne({ code });
    if (!group) return res.status(404).json({ error: "Gruppo non trovato" });

    if (!group.members.includes(req.user.id)) {
      group.members.push(req.user.id);
      await group.save();  
    }

    res.json(group);
  } catch (err) {
    console.error("ERRORE JOIN GROUP:", err);
    res.status(500).json({ error: "Errore join group" });
  }
});

//restituisce i gruppi dell'utente, intercetta GET /groups
router.get("/", auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id });
    res.json(groups);
  } catch (err) {
    console.error("ERRORE GET GROUPS:", err);
    res.status(500).json({ error: "Errore recupero gruppi" });
  }
});


//elimina gruppo e tasks (solo creatore puo eliminare) intercetta DELETE /groups/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Gruppo non trovato" });

    if (group.createdBy?.toString() !== req.user.id) {
    return res.status(403).json({ error: "Solo il creatore può eliminare il gruppo" });
  }
    const io = req.app.get("io");
    group.members.forEach(memberId => {
    io.to(`user_${memberId.toString()}`).emit("group:deleted", {groupId});
    });
 
    await Task.deleteMany({ groupId });
    await Group.findByIdAndDelete(groupId);

    res.json({ success: true });
  } catch (err) {
    console.error("ERRORE DELETE GROUP:", err);
    res.status(500).json({ error: "Errore eliminazione gruppo" });
  }
});


//lascia gruppo POST /groups/leave
router.post("/leave", auth, async (req, res) => {
  const { groupId } = req.body;

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ error: "Gruppo non trovato" });

  group.members = group.members.filter(
    (m) => m.toString() !== req.user.id.toString()
  );

  await group.save();

  res.json({ success: true });
});

module.exports = router;
