const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { nom, email, motDePasse } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

        const hash = await bcrypt.hash(motDePasse, 10);

        const user = new User({ nom, email, motDePasse: hash });
        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Login
exports.login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe incorrect" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, user: { nom: user.nom, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
