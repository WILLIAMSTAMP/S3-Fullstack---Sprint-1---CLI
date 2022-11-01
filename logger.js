const fs = require("fs");
const path = require("path");

const date = require("date-and-time");

// Creating object of current date and time
const d = new Date();
// Format date object
const eventDate = date.format(d, "YYYY-MM-DD").toString();
const eventTime = date.format(d, "HH:mm:ss").toString();

const fileName = `${eventDate}_Event_Log.txt`;

// Creating our logEvent function 
function logEvent(event, type, message) {
  if (DEBUG) console.log("logEvent Function called");
  const logItem = `${eventDate} - ${eventTime}\t${event}\t${type}\t${message}`;
  if (!fs.existsSync(path.join(__dirname, "/logs"))) {
    fs.mkdirSync(path.join(__dirname, "/logs"));
  } else {
    fs.appendFile(
      path.join(__dirname, "/logs", fileName),
      `${logItem}\n`,
      (err) => {
        if (err) console.log(err);
      }
    );
  }
}

// Exporting the module
module.exports = { logEvent };
