const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');

module.exports = (client, config) => {
    client.on('messageCreate', async (msg) => {
        let checkChat = await chat.findOne({ $or: [{ user1_channel: msg.channel.id }, { user2_channel: msg.channel.id }] });
        if(!checkChat) return;
        if(msg.author.bot) return;

        let checkUser = await user.findOne({ id: msg.author.id });

        let checkChannel1;
        checkChat.user1_channel === msg.channel.id ? checkChannel1 = true : checkChannel1 = false;

        checkChannel1 ? await client.channels.cache.get(checkChat.user2_channel).send(`🕵️ **${checkUser?.username}:** ${msg.content}`) : await client.channels.cache.get(checkChat.user1_channel).send(`🕵️ **${checkUser?.username}:** ${msg.content}`);

      });
  };