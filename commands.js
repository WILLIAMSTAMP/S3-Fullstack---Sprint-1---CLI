const initText = `
Usage:



Available commands for app init:
app init --all          Creates the folder structure, usage files and the config file.
app init --init         Creates the folder structure and adds usage files.
app init --fig          Creates the config file with the default settings.
app init --undo         Deletes the usage files and config file.
`;

const configText = `
Usage:

app config <command>

Available Configuration Commands:

app config --show            Displays a list of the current config settings.
app config --alter <key> <value>        Changes a specific configuration value.
`;

const tokenText = `
Usage:

app token <command>

Available Token Commands:

app token --create                            Creates the token.json file.
app token --undo                              Deletes the token.json file.          
app token --count                             Displays the count of the tokens created in the console.
app token --new <username> <email> <phone>    Generates a new token and pushes it to the tokens.json array as a new item.
app token --search <username>                 Displays all instances of the user in the tokens.json file and logs the search event.

`;

const configJSON = {
  name: "AppConfigCLI",
  description: "The Command Line Interface (CLI) for the App.",
  version: "1.0.0",
  main: "app.js",
  superuser: "adm1n",
};

module.exports = {
  initText,
  configText,
  configJSON,
  tokenText,
};