const Message = require("../models/Message");

// envoyer message
exports.sendMessage = async (req, res) => {
    try {
        const { receiver, text } = req.body;
        const message = new Message({
            sender: req.user.id,
            receiver,
            text
        });
        await message.save();
        res.json({ message: "Message envoyé avec succès" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// récupérer messages entre user connecté et un autre user
exports.getMessages = async (req, res) => {
    try {
        const userId = req.params.userId;
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: userId },
                { sender: userId, receiver: req.user.id }
            ]
        }).sort("createdAt");
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
