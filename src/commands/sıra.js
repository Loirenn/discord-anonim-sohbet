const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');
module.exports = {
    name: "sıra",
    description: "Sırada kaç kullanıcı olduğunu öğrenin.",
    options: [],
    perms: {
      user:  []
  },
    run: async (client, interaction) => {

        const db = await queue.find({}).lean();

        await interaction.reply({
           content: `Anonim sohbet arayan **${db?.length || 0}** kullanıcı bulunuyor.`,
            ephemeral: true
        });
       
    }
}