const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Collection } = require("discord.js");
const { connect } = require("mongoose");
const config = require('../../config.js');
const fs = require('fs');

const $command = [];
const $global_command = global._commands = new Collection();

module.exports = class Bot extends Client {
    get config() {
        return require('../../config.js');
    }

    async init() {
        fs.readdir(config.cmdDir, (err, commands) => {
            if (err) throw new Error(err);
            commands.forEach(async (command) => {
              try {
                const _cmdFile = require("../." + config.cmdDir + "/" + command);
                const { name, description, options } =
                  typeof _cmdFile == "function" ? _cmdFile(this) : _cmdFile;
                  $command.push({ name, description, options });
                const _command = require(`../commands/${command}`);
                $global_command.set(_command.name, _command);
              } catch (err) {
                console.error(err);
              }
            });
          });
          
        global.commands = $global_command.toJSON();
        const rest = new REST({ version: "9" }).setToken(config.client.token);

        this.once('ready', async () => {
            try {
                console.log("(*) # Loading application commands..");
                await rest.put(Routes.applicationCommands(this.user.id), {
                  body: _commands,
                });
                console.log("(*) # Application commands loaded!");
              } catch (err) {
                console.error(err);
              }
        });

        this.on('interactionCreate', (interaction) => {
            try {
                if (!interaction.isCommand()) return;
                  
                const __commands = $global_command.get(
                  interaction.commandName.toLowerCase()
                );
                if (
                  __commands.perms.user.length != 0 &&
                  !__commands.perms.user.every((perm) =>
                    interaction.member.permissions.has(perm)
                  )
                ) {
                  return;
                }
                fs.readdir(config.cmdDir, (err, commands) => {
                  if (err) throw new Error(err);
                  commands.forEach(async (command) => {
                    const _command = require("../." + config.cmdDir + "/" + command);
                    if (
                      interaction.commandName.toLowerCase() ===
                      _command.name.toLowerCase()
                    )
                      _command.run(this, interaction);
                  });
                });
              } catch (err) {
                console.error(err);
              }
        });

        fs.readdir("./src/events", async (err, files) => {
            if (files) {
              let loadedEvents = 0;
              console.log(`(*) # ${files.length} event found, loading..`);
              files.forEach((file) => {
                loadedEvents++;
                require(`${process.cwd()}/${"./src/events"}/${file}`)(this, config);
                if (loadedEvents == files.length)
                  console.log(`(*) # All events loaded! (${files.length})`);
              });
            }
          });

          connect(config.database.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
          }).then(() => {
            console.log(`(*) # Connected to database.`);
          }).catch(err => {
            console.error(err);
          });

          this.login(config.client.token)
          .then(() => {
            console.log(`(*) # Connected to Discord as ${this.user.tag}.`);
          })
          .catch(err => {
            console.error(err);
          });

    }

};