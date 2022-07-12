const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');
module.exports = {
    name: "biyografi",
    description: "Kendiniz hakkında bilgileri kaydedin.",
    options: [
        {
            type: 3,
            name: "biyografi",
            description: "Bir biyografi girin.",
            required: true
        }
    ],
    perms: {
      user:  []
  },
    run: async (client, interaction) => {

        const options = interaction.options._hoistedOptions;

        await user.updateOne({ id: interaction.user.id }, { $set: { aboutMe: options[0].value }}, { upsert: true });
        await interaction.reply({
            content: 'Biyografiniz başarıyla ayarlandı.\n```' + options[0].value + '```',
            ephemeral: true
        });

    }
}