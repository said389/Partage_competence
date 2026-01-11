// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// ------------------
// Middlewares
// ------------------
app.use(cors());
app.use(express.json());

// ------------------
// Routes
// ------------------
const userRoutes = require("./routes/users");
const publicationRoutes = require("./routes/publication");
const adminRoutes = require("./routes/admin");
const messageRoutes = require("./routes/messageRoutes"); 

app.use("/api/users", userRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);


// ------------------
// Connexion MongoDB
// ------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch(err => console.log(err));

// ------------------
// Lancement serveur
// ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur lancé sur le port ${PORT}`)
);



