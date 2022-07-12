const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');
module.exports = {
    name: "yasakla",
    description: "Kullanıcıyı sohbetten yasaklayın.",
    options: [
        {
            type: 3,
            name: "kullanıcı",
            description: "Bir kullanıcı girin.",
            required: true
        }
    ],
    perms: {
      user:  []
  },
    run: async (client, interaction) => {

        let checkUser = await user.findOne({ id: interaction.user.id });
        if(!checkUser?.isAdmin) return await interaction.reply({
            content: 'Bir kullanıcıyı yasaklamak için **ADMIN** yetkisine sahip olmalısınız.',
            ephemeral: true
        });

        let options = interaction.options._hoistedOptions[0];
        let checkOptionsUser = await user.findOne({ username: options.value });
        if(!checkOptionsUser) return await interaction.reply({
            content: 'Kullanıcı bulunamadı.',
            ephemeral: true
        });

        await user.updateOne({ id: options.value }, { $set: { isBanned: true }}, { upsert: true });
        await interaction.reply({
            content: 'Kullanıcı başarıyla yasaklandı.',
            ephemeral: true
        });

    }
}