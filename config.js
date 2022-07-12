const { Intents } = require('discord.js');

module.exports = {
    client: {
        token: "",
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES
        ],
    },
    database: {
        url: ""
    },
    cmdDir: "./src/commands"
}