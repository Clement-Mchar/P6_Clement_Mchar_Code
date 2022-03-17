const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken")
const User = require("../models/user");

// on initialise bcrypt, jwt et on récupère le modèle user

exports.signup = (req, res, next) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			user
				.save()
				.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

// on récupère et on crypte les infos entrées par l'user puis on créé l'user

exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                          { userId: user._id },
                          'RANDOM_TOKEN_SECRET',
                          { expiresIn: '24h' }
                        )
                      });
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

// on récupère les données entrées par l'user, on compare la compatibilité des infos entrées avec les données existantes
// si les infos user entrées ne concordent pas avec les infos user existantes, on interdit la connexion
// si les infos user entrées concordent avec les infos user existantes, on autorise la connexion