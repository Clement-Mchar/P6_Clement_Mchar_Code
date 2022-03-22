const express = require("express");
const helmet = require("helmet");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const path = require("path");


// on appelle le framework, la sécurité, la bdd, le bodyParser et les routes de l'API

require("dotenv").config();

mongoose
	.connect(process.env.DB_LINK, {
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

// On se connecte à la bdd 

const app = express();

app.use(express.json());

// on appelle express, on le rend exploitable par l'API

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	res.setHeader(
		"Cross-Origin-Resource-Policy",
		"cross-origin"
	);
	next();
});

// On set les autorisations

app.get(bodyParser.json);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
app.use(
	helmet()
);

// on rend les ressources et les routes accessibles

module.exports = app;

// on rend l'app importable pour le serveur
