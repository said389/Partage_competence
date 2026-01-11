const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require("../models/Message");
const User = require("../models/User");

// -----------------------------
// 1️⃣ Vérifier email avant chat
// -----------------------------
router.post("/check-email", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email non enregistré" });

        res.json({ message: "Email valide", userId: user._id, nom: user.nom });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------
// 2️⃣ Envoyer un message
// -----------------------------
router.post("/send", auth, async (req, res) => {
    const { receiverEmail, content } = req.body;

    try {
        const receiver = await User.findOne({ email: receiverEmail });
        if (!receiver) return res.status(404).json({ message: "Utilisateur introuvable" });

        const msg = new Message({
            sender: req.user.id,
            receiver: receiver._id,
            content
        });

        await msg.save();

        // Populate sender info
        await msg.populate("sender", "nom email");

        res.json(msg);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------
// 3️⃣ Récupérer messages entre deux utilisateurs
// -----------------------------
router.get("/with/:email", auth, async (req, res) => {
    try {
        const otherUser = await User.findOne({ email: req.params.email });
        if (!otherUser) return res.status(404).json({ message: "Utilisateur introuvable" });

        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: otherUser._id },
                { sender: otherUser._id, receiver: req.user.id }
            ]
        })
        .sort({ createdAt: 1 })
        .populate("sender", "nom email")
        .populate("receiver", "nom email");

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -----------------------------
// 4️⃣ Récupérer tous les utilisateurs avec qui on a discuté (distinct)
// -----------------------------
router.get("/conversations/all", auth, async (req, res) => {
    try {
        const msgs = await Message.find({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        })
        .populate("sender", "nom email")
        .populate("receiver", "nom email");

        // Extraire utilisateurs distincts
        const usersMap = {};
        msgs.forEach(m => {
            const other = m.sender._id.toString() === req.user.id ? m.receiver : m.sender;
            usersMap[other._id] = other;
        });

        const users = Object.values(usersMap);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
