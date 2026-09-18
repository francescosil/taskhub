const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connesso");

    const server = app.listen(PORT, () =>
      console.log(`Server avviato su porta ${PORT}`)
    );

    // Socket.IO setup
    const { Server } = require("socket.io");
    const io = new Server(server, {
      cors: { origin: "*" } // in produzione sostituire con origin del frontend
    });

    // Salva io nell'app Express così le route possono usarlo con req.app.get("io")
    app.set("io", io);

    io.on("connection", (socket) => {
      console.log("Socket connesso:", socket.id);

      // join rooms: il client invia { userId, groups: [groupId,...] }
      socket.on("joinRooms", ({ userId, groups }) => {
        if (userId) {
          socket.join(`user_${userId}`); // room personale
        }
        if (Array.isArray(groups)) {
          groups.forEach(gid => socket.join(`group_${gid}`));
        }
      });

      // opzionale: lascia stanze
      socket.on("leaveRooms", ({ userId, groups }) => {
        if (userId) socket.leave(`user_${userId}`);
        if (Array.isArray(groups)) {
          groups.forEach(gid => socket.leave(`group_${gid}`));
        }
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnesso:", socket.id);
      });
    });

  })
  .catch(err => console.error("Errore MongoDB:", err));
