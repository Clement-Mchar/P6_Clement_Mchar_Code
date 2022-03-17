const multer = require("multer");

//on utilise le package multer pour l'upload de fichiers (ici, des images)

const MIME_TYPES = {
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/png": "png",
};

// on set les mime types pour éviter les problèmes de format

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "images");
	},
	filename: (req, file, callback) => {
		let name = file.originalname.split(" ").join("_");
		name = name.toLowerCase();
		const extension = MIME_TYPES[file.mimetype];
		name = name.replace("." + extension, "_");

		callback(null, name + Date.now() + "." + extension);
	},
});

// on indique au multer la destination des images, on remplace les extensions par celles prévues par les mime types
// on ajoute un timestamp au nom du fichier

module.exports = multer({ storage: storage }).single("image");
// on exporte le multer
