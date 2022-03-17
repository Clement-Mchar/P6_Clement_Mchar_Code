const http = require("http");
const app = require("./app");
const uri = process.env.MONGODB_URI;

// on appelle l'app et le .env(adresse du serveur), on indique le format de la requête et
const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

// on force le port à retourner un integer

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// on paramètre le numéro de port

const errorHandler = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === "string" ? "pipe" + address : "port: " + port;
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};

// on attrape les erreurs, on les affiche

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port " + port;
	console.log("Listening on " + bind);
});
server.listen(port);

// on démarre le serveur
