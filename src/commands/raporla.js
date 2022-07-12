const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');
module.exports = {
    name: "raporla",
    description: "Bir kullanıcıyı raporlayın.",
    options: [
        {
            type: 3,
            name: "kullanıcı",
            description: "Bir kullanıcı adı girin.",
            required: true
        },
        {
            type: 3,
            name: "sebep",
            description: "Kullanıcı neden raporlamak istiyorsunuz?",
            required: true
        }
    ],
    perms: {
      user:  []
  },
    run: async (client, interaction) => {

        const options = interaction.options._hoistedOptions;
        const checkUser = await user.findOne({ username: options[0].value });
        if(!checkUser) return await interaction.reply({
           content: 'Kullanıcı bulunamadı.',
            ephemeral: true 
        });
        
        if(checkUser?.id === interaction.user.id) return await interaction.reply({
            content: 'o_O kEnDiNiZi RaPoRlAyAmAzSıNıZ.',
            ephemeral: true
        });

        await user.updateOne({ id: checkUser.id }, { $inc: { reported: 1 }}, { upsert: true });
        await interaction.reply({
            content: 'Kullanıcı başarıyla raporlandı.',
            ephemeral: true 
        });

    }
}