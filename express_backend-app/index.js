const express = require("express");
const app = express();
const port = 3001;

const USERS = [];
const QUESTIONS = [
  {
    title: "Two states",
    description: "Given 2 array, return the maximum of the array",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

app.post("/signup", (req, res) => {
  // Add logic to decode body
  // body should have email and password

  // store email and password (as is for now) in the USERS array above(only if the user with the given email doesn't exist)
  // also ensure password is same

  // is pasword is same, return back 200 status code to the client
  // also send back a token (any random string will do now)
  // if the password is not the same, return back 401 status ccode to the client

  res.send("Hello World!");
});

app.post("/login", (req, res) => {
  res.json({ name: "Manish", age: "21" });
});

app.get("/questions", (req, res) => {
  // return the user all the questions in the question array
  res.json({ name: "Manish", age: "21" });
});

app.get("/submissions", (req, res) => {
  // return the user submisions for this problem
  res.json({ name: "Manish", age: "21" });
});

app.post("/submissions", (req, res) => {
  // let the user submit the question,randomly accept or reject the solution
  res.json({ name: "Manish", age: "21" });
});

// create a route that lets an admin add a new problem
// ensure that only admin can do that

// app.get("/chat", (req, res) => {
// 	res.send(`<html>

//     <body>
//     <h1 style="color:red;   ">
//     Hello </h1>
//     </body></html>`);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
