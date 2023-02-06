const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const router = require("./router/route");
const http = require("http");
const cors = require("cors");

require("dotenv").config();

const port = normalizePort();
const app = express();

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

// routes...
app.use("/", router);
app.use(express.static(path.join(__dirname + "/public")));

//To allow cross-origin requests
app.use(cors());

connectMongoDB();

const server = http.createServer(app);

app.set("port", port);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onListening() {
	console.log("App listening on ", server.address());
}

function onError(error) {
	console.error("Couldn't start the server. Error > ", error);
}

function normalizePort() {
	if (typeof process.env.PORT === "number") {
		return process.env.PORT;
	} else {
		return 3000;
	}
}

function connectMongoDB() {
	const mongoUri = process.env.MONGO_URI;
	if (mongoUri === "") {
		console.error("Can't find Mongo URI in ENV.");
		process.exit(1);
	}
	mongoose
		.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			console.log("Connected to the MongoDB!");
		})
		.catch((error) => {
			console.error("Can't connect to the MongoDB. Error > ", error);
		});
}
