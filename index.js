const Client = require('./src/client/index');
const config = require('./config');
const Modals = require('discord-modals');
const client = global.client = new Client({ intents: config.client.intents });
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
Modals(client);

//start bot
client.init();