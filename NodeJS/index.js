// import http from "http";
import fs from "fs";
// import myName, { myName2, myName3 } from "./features.js";
// import path from "path";

// const http = require("http");/
// const myName = require("./features.js");

// Module:
// 1. Built In: like http
// 2. 3rd party
// 3. File based

// Importing modules
// console.log(myName, myName2, myName3);

////////////////////////////////////////////////////////////////////////////////
// Writing in a file
// const input = ` this file is being appended`;
// fs.appendFileSync("/home/manish/Desktop/testfs.txt", input);

// Reading from a file
// const textIn = fs.readFileSync("/home/manish/Desktop/testfs.txt", "utf-8");
// console.log(textIn);

// Writing asynchronously:
// const input = ` this file is being appended in async Mode not`;
// fs.appendFile("/home/manish/Desktop/testAsync.txt", input,(err,));

// Reading Asynchronously;

// const textInAsync = fs.readFile(
// 	`/home/manish/Desktop/testAsync.txt`,
// 	"utf-8",
// 	(err, data1) => {
// 		console.log(data1);
// 		fs.readFile(`/home/manish/Desktop/${data1}.txt`, "utf-8", (err, data2) => {
// 			console.log(data2);
// 			fs.writeFile(
// 				`/home/manish/Desktop/${data1}.txt`,
// 				input,
// 				`utf-8`,
// 				(err) => {
// 					fs.readFile(
// 						`/home/manish/Desktop/${data1}.txt`,
// 						"utf-8",
// 						(err, data4) => {
// 							console.log(data4);
// 						}
// 					);
// 					return;
// 				}
// 			);
// 		});
// 	}
// );
/////////////////////////////////////////////////////////////////////////////////////////////////
// SERVER:
/*
 
// this code is executed only once and hence we can use synchronous way...
const data = fs.readFileSync(`./DevData/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
	// Mehtods:
	// GET: to read data
	// POST: create data
	// PUT: Update data
	// DELETE: to delete
	console.log(req.method);

	// Routing: Navigation
	if (req.url === "/about") {
		res.end("<h1>About Page</h1>");
	} else if (req.url === "/") {
		res.end("<h1>Home </h1>");
	} else if (req.url === "/contact") {
		res.end("<h1>Contact Page</h1>");
	} else if (req.url === "/api") {
		res.writeHead(200, { "Content-type": "application/json" });
		res.end(data);
	} else {
		res.writeHead(404, {
			"Content-type": `Text/HTML`,
			"my-own-data-bitch": `this is the meta data`,
		});
		res.end("<h1>Page not found</h1>");
	}
});

server.listen(5000, () => {
	console.log("Server is working");
});
*/

///////////////////////////////////////////////////////////////////////////////////
// EXPRESS
///////////////////////////////////////////////////////////////////////
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const app = express();

const users = [];
// MIDDLEWARES:
// To access static files
app.use(express.static(path.join(path.resolve(), "public")));
// posting data from the form
app.use(express.urlencoded({ extended: true }));

// Setting up View engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	// res.sendStatus(200)
	// res.status(404).json([{ name: "manish", age: 21 }]);
	// res.json([{ name: "manish", age: 21 }]);
	// res.send("<p>Lola</p>");
	// const pathToFile = path.resolve();
	// console.log(path.join(pathToFile, "./DevData/data.json"));
	// res.sendFile(path.join(pathToFile, "./index.html"));
	// res.sendFile(path.join(pathToFile, "./DevData/data.json"));
	res.render("index", { name: "Manish" });
});

app.get("/success", (req, res) => {
	res.render("success");
});

app.post("/contact", (req, res) => {
	users.push({ username: req.body.name, email: req.body.email });
	// res.render("success");
	res.redirect("/success");
});

app.get("/users", (req, res) => {
	res.json({ users });
});

app.listen(5000, () => {
	console.log("Server is woking!!");
});
