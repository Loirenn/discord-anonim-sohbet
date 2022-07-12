const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');
module.exports = {
    name: "admin",
    description: "Kullanıcıya admin yetkisi verin.",
    options: [
        {
            type: 3,
            name: "kullanıcı",
            description: "Bir kullanıcı girin.",
            required: true
        }
    ],
    perms: {
      user:  ["ADMINISTRATOR"]
  },
    run: async (client, interaction) => {

        let options = interaction.options._hoistedOptions[0];
        let checkOptionsUser = await user.findOne({ username: options.value });
        if(!checkOptionsUser) return await interaction.reply({
            content: 'Kullanıcı bulunamadı.',
            ephemeral: true
        });

        await user.updateOne({ id: options.value }, { $set: { isAdmin: true }}, { upsert: true });
        await interaction.reply({
            content: 'Kullanıcıya başarıyla admin yetkisi verildi.',
            ephemeral: true
        });

    }
}