const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
		const userId = decodedToken.userId;
		req.auth = { userId };
		if (req.body.userId && req.body.userId !== userId) {
			throw "Invalid user ID";
		} else {
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error("Invalid request!"),
		});
	}
};
// à chaque tentative de requête, on vérifie le token de l'utilisateur, puis, si il en a un et qu'il est différent, on invalide la requête 