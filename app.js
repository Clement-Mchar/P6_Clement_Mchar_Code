const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const stuffRoutes = require('./routes/stuff');

mongoose
	.connect(
		"mongodb+srv://Geno77:CXnuXixQ7fmIWOvW@cluster0.yzgpk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log("Bien joué beau-gosse"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(express.json());

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
	next();
});

app.get(bodyParser.json);

app.use('/api/stuff', stuffRoutes);


module.exports = app;
