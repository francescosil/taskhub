const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/auth"); 
const Task = require("../models/tasks");
const Group = require("../models/group");


//intercetta POST /users/register per la registrazione di un account
router.post("/register", async (req, res) => {
  try {
    const { nome, cognome, email, password, age, sex, birthplace } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e password sono obbligatori" });
    }

    if (!nome || !cognome) {
      return res.status(400).json({ error: "Nome e cognome sono obbligatori" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ nome, cognome, email, password: hashed, age, sex, birthplace });

    return res.status(201).json({ success: true, message: "Registrazione effettuata. Ora accedi." });
  } catch (err) {
    console.error("ERRORE REGISTER:", err);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email gia usata. Usa un altro indirizzo email." });
    }
    return res.status(500).json({ error: "Errore registrazione" });
  }
});

//intercetta POST /users/login e effettua login, inoltre crea token jwt utile per autenticazione
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Utente non trovato" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Password errata" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({ token, userId: user._id });
  } catch (err) {
    console.error("ERRORE LOGIN:", err);
    return res.status(500).json({ error: "Errore login" });
  }
});

//intercetta GET /users/me ottiene le informazioni account
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("nome cognome email age sex birthplace");

    if (!user) return res.status(404).json({ error: "Utente non trovato" });

    res.json(user);
  } catch (err) {
    console.error("ERRORE /me:", err);
    res.status(500).json({ error: "Errore server" });
  }
});

//intercetta PUT /users/me e modifica account
router.put("/me", auth, async (req, res) => {
  try {
    const updates = {};

    const fields = ["nome", "cognome", "email", "age", "sex", "birthplace"];
    fields.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("Errore update user:", err);
    res.status(500).json({ error: "Errore aggiornamento dati" });
  }
});


//intercetta DELETE /users/me e elimina accoutn
router.delete("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;
 
    await Task.deleteMany({ userId });
    await Group.deleteMany({ createdBy: userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account eliminato correttamente" });

  } catch (err) {
    console.error("Errore eliminazione utente:", err);
    res.status(500).json({ error: "Errore server" });
  }
});





module.exports = router;
