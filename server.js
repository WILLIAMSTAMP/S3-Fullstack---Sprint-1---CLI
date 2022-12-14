// import the required module
var express = require("express");
const path = require("path");
const fs = require("fs");

//store the express in a variable
var app = express();
const { newToken, findUser, countToken } = require("./token");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./webViews"));

global.DEBUG = false;

app.get("/", function (req, res) {
  res.render(__dirname + "/webViews/" + "index.ejs");
});

//Sends the user token to the path generated by the form
app.get("/newUser", function (req, res) {
  response = {
    Token: newToken(req.query.username, req.query.email, req.query.phone),
  };
  res.end(JSON.stringify(response));
});


// Display token info for specified user
app.get("/findUser", function (req, res) {
  findUser(req.query.username);
  setTimeout(() => {
    fs.readFile(__dirname + "/views/findUser.txt", (err, data) => {
      if (err) throw err;
      else  res.render(__dirname + "/webViews/" + "tokens.ejs");
    });
  }, 1000);
});

// Counts the tokens and adds it to a countToken.txt file
app.get("/countToken", function (req, res) {
  countToken();
  setTimeout(() => {
    fs.readFile(__dirname + "/views/countToken.txt", (err, data) => {
      if (err) throw err;
      else res.end(data);
    });
  }, 2000);
});

// This will only be used if none of the above conditions are met
app.use((req, res) => {
  res.status(404).render("404");
});

//Create the server
//specify a port fro the app to listen
const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log("App listening at port: ", port);
});
