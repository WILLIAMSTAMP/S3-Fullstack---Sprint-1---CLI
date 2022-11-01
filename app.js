/*

Sprint 1
Full Stack Semester 3
Chris, Mark, William, Neil


*/
// Enable or disable DEBUG mode
global.DEBUG = false;

const fs = require("fs");
const args = process.argv.slice(2);

const { initDir, initFs } = require("./init.js");
const {
  displayConfig,
  setConfig,
  resetConfig,
  addConfig,
} = require("./config.js");
const { configText, initText, tokenText } = require("./commands.js");
const { newToken, countToken, findUser, setToken, isExp } = require("./token");

switch (args[0]) {
  case "help":
  case "h":
    if (DEBUG)
      console.log(`\napp.js Arguments: ${args}\napp.js Case: 'help' or 'h'\n`);

    console.log(initText);
    console.log(configText);
    console.log(tokenText);
    break;
  default:
    if (DEBUG) console.log(`\nArguments: ${args}\nCase: 'default'\n`);
    console.log('Use the "--help" or "--h" to view available commands\n');
    break;
    // 
    // 
    // 
  case "init":
  case "i":
    if (DEBUG)
      console.log(`\napp.js Arguments: ${args}\napp.js Case: 'init' or 'i'\n`);
    if (args[1] === "--all") {
      initDir();
      initFs();
    }
    if (args[1] === "--dir") {
      initDir();
    }
    if (args[1] === "--fs") {
      initFs();
    }
    if (args[1] === "--help" || args[1] === "--h" || args[1] === undefined) {
      console.log(initText);
    }
    break;
  case "config":
  case "c":
    if (DEBUG)
      console.log(
        `\napp.js Arguments: ${args}\napp.js Case: 'config' or 'c'\n`
      );
    if (args[1] === "--show") {
      displayConfig();
    }
    if (args[1] === "--reset") {
      resetConfig();
    }
    if (args[1] === "--set") {
      setConfig();
    }
 
    if (args[1] === "--add") {
      addConfig();
    }
    if (args[1] === "--help" || args[1] === "--h" || args[1] === undefined) {
      console.log(configText);
    }
    break;
  case "token":
  case "t":
    if (DEBUG)
      console.log(`\napp.js Arguments: ${args}\napp.js Case: 'token' or 't'\n`);
    if (args[1] === "--count") {
      countToken();
    }
    if (args[1] === "--new") {
      console.log(newToken(args[2], args[3], args[4]));
      
    }
    
    if (args[1] === "--search") {
      findUser(args[2]);
      isExp(args[2]);
    }
    if (args[1] === "--set") {
      setToken(args[2]);
    }

    if (args[1] === "--help" || args[1] === "--h" || args[1] === undefined) {
      console.log(tokenText);
    }
  
}
