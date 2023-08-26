const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// wirting our own middleware
const manishMiddleware = (req, res, next) => {
	console.log(req);
	// to run next middleware after this middleware is executed
	next();
};
// app.use(manishMiddleware);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.send("Hello peeps");
});

app.get("/hello/:name", (req, res) => {
	res.send("Hello world!" + req.params.name);
});

app.get("/about", (req, res) => {
	// res.send("Hello peeps");
	res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
	console.log("Server is working");
});
