const fs = require("fs");
const args = process.argv.slice(2);
const path = require("path");

const { initText, configText, tokenText } = require("./commands");
const { logEvent } = require("./logger.js");

const Emitter = require("events");
class MyEmitter extends Emitter {}
const myEmitter = new MyEmitter();

myEmitter.addListener("log", (event, type, message) =>
  logEvent(event, type, message)
);

// Writes file to init.txt file or creates one if none is there
function writeFile(filename, text) {
  fs.writeFile(path.join(__dirname, "views", filename), text, (err) => {
    if (err) console.log(err);
    else if (DEBUG) console.log(`Filename: ${filename} created`);
  });
}

// Creating the initFs function
function initFs() {
  if (DEBUG) console.log("Init Files Function called");
  if (!fs.existsSync(path.join(__dirname, "./views"))) {
    console.log(
      'Directory "views" does not exist.\nUse "init --dir" prior to or "init --all" \n'
    );
  } else {
    writeFile("init.txt", initText);
    writeFile("config.txt", configText);
    writeFile("token.txt", tokenText);
    myEmitter.emit("log", "initFs()", "INFO", "Help display files initialized");
  }
}

function mkDir(dir) {
  fs.mkdir(path.join(__dirname, dir), (err) => {
    if (err) console.log(err);
    else if (DEBUG) console.log("Directory created.");
  });
}

function dirCheck(dir) {
  if (fs.existsSync(path.join(__dirname, "./" + dir))) {
    if (DEBUG) console.log(dir + " Directory already exists");
    return true;
  }
}

function initDir() {
  if (DEBUG) console.log("initDir Function called");
  if (dirCheck("./views") === true) {
    console.log('Directory "./views" already exists');
    myEmitter.emit(
      "log",
      "initDir()",
      "WARN",
      "Directory '/views' already exists"
    );
  } else {
    mkDir("views");
    myEmitter.emit(
      "log",
      "initDir()",
      "INFO",
      "Directory '/views' created successfully"
    );
  }
}
// Exporting the modules 
module.exports = {
  initDir,
  initFs,
};
