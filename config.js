const fs = require("fs");
const path = require("path");

const { configJson } = require("./commands");

const { logEvent } = require("./logger.js");

const Emitter = require("events");
class MyEmitter extends Emitter {}
const myEmitter = new MyEmitter();

myEmitter.addListener("log", (event, type, message) =>
  logEvent(event, type, message)
);

const args = process.argv.slice(2);

// Creating a function to display information to the config.json file
function displayConfig() {
  if (DEBUG) console.log("displayConfig Function called");
  fs.readFile(__dirname + "/config.json", (error, data) => {
    if (error) {
      console.log(err);
      myEmitter.emit(
        "log",
        "displayConfig()",
        "ERROR",
        "File: 'config.json' could not be displayed"
      );
    } else {
      console.log(JSON.parse(data));
      myEmitter.emit(
        "log",
        "displayConfig()",
        "INFO",
        "File: 'config.json' was displayed successfully"
      );
    }
  });
}

// Creating the setConfig function
function setConfig() {
  if (DEBUG) console.log("config.setConfig()");
  if (DEBUG) console.log(args);
  let match = false;
  fs.readFile(__dirname + "/config.json", (error, data) => {
    if (error) {
      myEmitter.emit(
        "log",
        "setConfig()",
        "ERROR",
        "File: 'config.json' could not be read"
      );
      throw error;
    }
    if (DEBUG) console.log(JSON.parse(data));
    let cfg = JSON.parse(data);
    for (let key of Object.keys(cfg)) {
      if (key === args[2]) {
        cfg[key] = args[3];
        match = true;
      }
      if (!match) {
        console.log(`invalid key: ${args[2]}, try another.`);
        myEmitter.emit(
          "log",
          "setConfig()",
          "WARN",
          `File: 'config.json' invalid key: ${args[2]}`
        );
      }
    }
    if (DEBUG) console.log(cfg);
    data = JSON.stringify(cfg, null, 2);
    fs.writeFile(__dirname + "/config.json", data, (error) => {
      if (error) {
        myEmitter.emit(
          "log",
          "setConfig()",
          "ERROR",
          "File: 'config.json' could not be updated"
        );
        throw error;
      }
      console.log("Config file successfully updated.");
      myEmitter.emit(
        "log",
        "setConfig()",
        "INFO",
        "File: 'config.json' was successfully updated"
      );
    });
  });
}

// Creating the addConfig function
function addConfig() {
  if (DEBUG) console.log("config.setConfig()");
  if (DEBUG) console.log(args);
  fs.readFile(__dirname + "/config.json", (error, data) => {
    if (error) {
      myEmitter.emit(
        "log",
        "setConfig()",
        "ERROR",
        "File: 'config.json' could not be read"
      );
      throw error;
    }
    if (DEBUG) console.log(JSON.parse(data));
    let cfg = JSON.parse(data);
    cfg[args[2]] = args[3];
    data = JSON.stringify(cfg);
    fs.writeFile(__dirname + "/config.json", data, (error) => {
      if (error) {
        myEmitter.emit(
          "log",
          "addConfig()",
          "ERROR",
          "File: 'config.json' could not be updated"
        );
        throw error;
      }
      if (DEBUG) console.log("Config file successfully updated.");
      myEmitter.emit(
        "log",
        "addConfig()",
        "INFO",
        "File: 'config.json' was successfully updated"
      );
    });
  });
}

// Creating resetConfig function
function resetConfig() {
  if (DEBUG) console.log("resetConfig Function called");
  let configdata = JSON.stringify(configJson, null, 2);
  fs.writeFile(__dirname + "/config.json", configdata, (error) => {
    if (error) {
      myEmitter.emit(
        "log",
        "resetConfig()",
        "ERROR",
        "File: 'config.json' could not be reset"
      );
      throw error;
    }
    if (DEBUG) console.log("Config file reset to original state");
    myEmitter.emit(
      "log",
      "resetConfig()",
      "INFO",
      "File: 'config.json' was reset to default values"
    );
  });
}
// Exporting the modules 
module.exports = {
  displayConfig,
  setConfig,
  resetConfig,
  addConfig,
};
