const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

const crc32 = require("crc/crc32");

const date = require("date-and-time");


const d = new Date();
const now = date.format(d, "YYYY/MM/DD HH:mm:ss");
const expDate = date.format(date.addDays(d, 3), "YYYY/MM/DD HH:mm:ss");

const { logEvent } = require("./logger.js");

const Emitter = require("events");
const { config, argv } = require("process");
class MyEmitter extends Emitter {}
const myEmitter = new MyEmitter();

myEmitter.addListener("log", (event, type, message) =>
  logEvent(event, type, message)
);

function countToken() {
  if (DEBUG) console.log("countToken Function called");

  fs.readFile(__dirname + "/tokens.json", (err, data) => {
    if (err) {
      myEmitter.emit(
        "log",
        "countToken()",
        "ERROR",
        "File: 'tokens.json' could not be read"
      );
      console.log(err);
    } else {
      let tokens = JSON.parse(data);
      if (DEBUG) console.log(tokens);
      let count = Object.keys(tokens).length;
      console.log(`There are ${count} Tokens stored.`);
      myEmitter.emit(
        "log",
        "countToken()",
        "INFO",
        "File: 'config.json' read successfully and token count provided"
      );
      writeFile("countToken.txt", `There were ${count} Tokens created.`);
    }
  });
}

function newToken(username, email, phone) {
  if (DEBUG) console.log("newToken Function called");
  let newToken = JSON.parse(`{
        "created": "",
        "username": "",
        "email": "",
        "phone": "",
        "token": "",
        "expires": ""
  }`);
  
  newToken.created = now;
  newToken.username = username;
  newToken.email = email;
  newToken.phone = phone;
  newToken.token = crc32(username).toString(16);
  newToken.expires = expDate;
  
  fs.readFile(__dirname + "/tokens.json", "utf-8", (err, data) => {
    if (err) {
      myEmitter.emit(
        "log",
        "newToken()",
        "ERROR",
        "File: 'tokens.json' could not be read"
      );
      throw err;
    }

    let tokens = JSON.parse(data);

    tokens.push(newToken);
    let userTokens = JSON.stringify(tokens);

    fs.writeFile(__dirname + "/tokens.json", userTokens, (err) => {
      if (err) {
        myEmitter.emit(
          "log",
          "newToken()",
          "ERROR",
          "File: 'tokens.json' could not be updated"
        );
        throw err;
      } else {
        console.log(`New token ${newToken.token} was created for ${username} ${email} ${phone}.`);
        myEmitter.emit(
          "log",
          "newToken()",
          "INFO",
          "File: 'tokens.json' successfully updated"
        );
      }
    });
  });
  return newToken.token;
}

function findUser(user) {
  if (DEBUG) console.log("findUser Function called for " + user);

  fs.readFile(__dirname + "/tokens.json", (err, data) => {
    let result = "";
    if (!err) {
      let tokens = JSON.parse(data);
      tokens.forEach((token) => {
        if (token.username === user) {
          
          console.log(token);
          result = token;
          myEmitter.emit(
            "log",
            "findUser()",
            "INFO",
            "File: 'tokens.json' successfully read, User: '" + user + "' found"
          );
        }
      });
      writeFile("findUser.txt", JSON.stringify(result));
      writeFile("../webViews/tokens.ejs", '<!DOCTYPE html> \n <html lang="en"> \n <head> \n <style> \n #top { \n margin-top: 200px; \n } \n table, th, td { \n border: 1px solid black; \n margin-top: 65px; \n margin-left: auto; \n margin-right: auto; \n } \n body { \n background-image: url(https://keyin.com/wp-content/uploads/BLANKshareable2.png); \n background-size: 100%;\n background-position-y: 25%; \n background-color: #1c2c44; \n background-repeat:no-repeat; \n min-width: 70%; \n text-align: center; \n box-sizing: border-box; \n font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; \n } \n </style> \n <title>Node Stuff</title> \n <meta charset="UTF-8" /> \n <meta name="viewport" content="width=device-width,initial-scale=1" /> \n </head> \n <body> \n <header> \n <div id=header style="margin-top:200px;"> \n <span>Keyin College</span> \n <span>Semester 3 Sprint 1 - Full Stack Javascript</span> \n <span>Group 1</span> \n </div> \n </header> \n <h1>Token Search Result:</h1> \n <table> \n <tr> \n <th>Username:</th> \n <td>'+JSON.stringify(result.username)+'</td> \n </tr> <th>Email:</th> \n <td>'+JSON.stringify(result.email)+'</td> \n <tr> <th>Phone:</th> \n <td>'+JSON.stringify(result.phone)+'</td> \n </tr> <tr> \n <th>Token:</th> \n <td>'+JSON.stringify(result.token)+'</td> \n </tr> \n <tr> \n <th>Created:</th> \n <td>'+JSON.stringify(result.created)+'</td> \n </tr> \n <tr> \n <th>Expires:</th> \n <td>'+JSON.stringify(result.expires)+'</td> \n </tr> \n </table> \n </body> \n </html>'  )
      isExp(user);
    } else {
      console.log(err);
      myEmitter.emit(
        "log",
        "findUser()",
        "ERROR",
        "File: 'tokens.json' could not be read"
      );
    }
  });
}

function setToken(user) {
  if (DEBUG) console.log("Token.setToken()");
  if (DEBUG) console.log(args);
  const att = args[3];
  const val = args[4];
  let match = false;
  fs.readFile(__dirname + "/tokens.json", (error, data) => {
    if (error) {
      myEmitter.emit(
        "log",
        "setToken()",
        "ERROR",
        "File: 'tokens.json' could not be read"
      );
      throw error;
    }
    let tokens = JSON.parse(data);
    if (DEBUG) console.log(tokens);
    tokens.forEach((token) => {
      if (token.username === user) {
        token[att] = val;
        match = true;
      }
      if (!match) {
        console.log(`invalid key: ${args[2]}, try another.`);
        myEmitter.emit(
          "log",
          "setToken()",
          "WARN",
          `File: 'tokens.json' invalid key: ${args[2]}`
        );
      }
    });
  
    if (DEBUG) console.log(tokens);
    data = JSON.stringify(tokens, null, 2);
    fs.writeFile(__dirname + "/tokens.json", data, (error) => {
      if (error) {
        myEmitter.emit(
          "log",
          "setToken()",
          "ERROR",
          "File: 'tokens.json' write Failure"
        );
        throw error;
      }
      console.log(
        `Token successfully updated. User: ${user} Attribute: ${args[3]} Value: ${args[4]}`
      );
      myEmitter.emit(
        "log",
        "setToken()",
        "INFO",
        `File: 'tokens.json' Token successfully updated User: ${user} Attribute: ${args[3]} Value: ${args[4]}`
      );
    });
  });
}

// Creating the isExp function
function isExp(user) {
  fs.readFile(__dirname + "/tokens.json", (err, data) => {
    let result = `User: ${user} could not be found`;
    if (!err) {
      let tokens = JSON.parse(data);
      tokens.forEach((token) => {
        if (token.username === user) {
          result = token.expires;
        }
      });
      console.log(result);
      if (result < now) {
        console.log(`The token for ${user} expired ${result}`);
        myEmitter.emit(
          "log",
          "checkToken()",
          "WARN",
          "File: 'tokens.json' checked token expired for User: " + user
        );
        appendFile("findUser.txt", `\nThe token for ${user} expired ${result}`);
      } else {
        myEmitter.emit(
          "log",
          "checkToken()",
          "INFO",
          "File: 'tokens.json' checked token expiry date of User: '" + user
        );
        appendFile(
          "isExp.txt",
          `\nThe token for ${user} expired on ${result}`
        );
      }
    } else {
      console.log(err);
      myEmitter.emit(
        "log",
        "findUser()",
        "ERROR",
        "File: 'tokens.json' could not be read"
      );
    }
  });
}
function writeFile(filename, text) {
  fs.writeFile(path.join(__dirname, "views", filename), text, (err) => {
    if (err) console.log(err);
    else if (DEBUG) console.log(`Filename: ${filename} created`);
  });
}
function appendFile(filename, text) {
  fs.appendFile(path.join(__dirname, "views", filename), text, (err) => {
    if (err) console.log(err);
    else if (DEBUG) console.log(`Filename: ${filename} appended`);
  });
}

// exporting the modules
module.exports = {
  newToken,
  countToken,
  findUser,
  setToken,
  isExp,
};
