const Sauce = require("../models/sauce");

const fs = require("fs");
const sauce = require( "../models/sauce" );

// on récupère le modèle des sauces et on appelle fs pour interagir avec les fichiers

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [" "],
		usersdisLiked: [" "],
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
		.catch((error) => res.status(400).json({ error }));
};

// on parse le corps de la requête, on créé la sauce, on la poste, on attrape l'erreur

exports.getOneSauce = (req, res, next) => {
	if (sauce.userId !== req.body.userId) {
		return res.status(401).json({ message: "Unauthorized Request" });
	}
	Sauce.findOne({
		_id: req.params.id,
	})
		.then((sauce) => {
			res.status(200).json(sauce);
		})
		.catch((error) => {
			res.status(404).json({
				error: error,
			});
		});

};

//  on récupère l'id, on récupère les infos de la sauce, on attrape l'erreur

exports.modifySauce = (req, res, next) => {

	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {});
		})
		.catch((error) => res.status(500).json({ error }));
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	Sauce.updateOne(
		{ _id: req.params.id },
		{ ...sauceObject, _id: req.params.id }
	)
		.then(() => res.status(200).json({ message: "Sauce modifiée !" }))
		.catch((error) => res.status(400).json({ error }));
};

// on récupère l'id, on modifie et on update les données de la sauce

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce supprimée !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

// on trouve la sauce, on détache l'image, on supprime la sauce, on renvoi au back

exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			res.status(200).json(sauces);
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

// on récupère et on affiche toutes les sauces

exports.likeSauce = (req, res, next) => {
	switch (req.body.like) {
		case 1:
			Sauce.updateOne(
				{ _id: req.params.id },
				{ $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
			)
				.then(() => res.status(200).json({ message: `J'aime` }))
				.catch((error) => res.status(400).json({ error }));

			break;

		// On récupère les données de la sauce, on incrémente le nombre de likes, on envoi au back

		case 0:
			Sauce.findOne({ _id: req.params.id })
				.then((sauce) => {
					if (sauce.usersLiked.includes(req.body.userId)) {
						Sauce.updateOne(
							{ _id: req.params.id },
							{ $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
						)
							.then(() => res.status(200).json({ message: `Neutre` }))
							.catch((error) => res.status(400).json({ error }));
					}
					if (sauce.usersDisliked.includes(req.body.userId)) {
						Sauce.updateOne(
							{ _id: req.params.id },
							{
								$pull: { usersDisliked: req.body.userId },
								$inc: { dislikes: -1 },
							}
						)
							.then(() => res.status(200).json({ message: `Neutre` }))
							.catch((error) => res.status(400).json({ error }));
					}
				})
				.catch((error) => res.status(404).json({ error }));
			break;

		// si l'utilisateur a déjà liké et qu'il l'enlève on enlève 1 like du compteur
		// si l'utilisateur a déjà disliké la sauce et qu'il l'enlève on enlève 1 dislike du compteur

		case -1:
			Sauce.updateOne(
				{ _id: req.params.id },
				{ $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
			)
				.then(() => {
					res.status(200).json({ message: `Je n'aime pas` });
				})
				.catch((error) => res.status(400).json({ error }));
			break;

		default:
			console.log(error);
	}
};
// on récupère les données de la sauce et on rajoute un dislike au compteur
