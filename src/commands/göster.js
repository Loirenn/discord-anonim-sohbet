const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');
module.exports = {
    name: "göster",
    description: "Sohbet ettiğiniz kullanıcıya biyografinizi gösterin.",
    options: [],
    perms: {
      user:  []
  },
    run: async (client, interaction) => {

        let user1;
        let checkChat = await chat.findOne({  $or: [{ user1: interaction.user.id }, { user2: interaction.user.id }] });
        checkChat.user1 === interaction.user.id ? user1 = true : user1 = false;
        let checkUser = await user.findOne({ id: interaction.user.id });
        let checkUser2 = await user.findOne({ id: user1 ? checkChat.user2 : checkChat.user1 });

        if(!checkUser?.isChat) return interaction.reply({
           content: 'Herhangi bir sohbette değilsiniz.',
           ephemeral: true
        });

        if(!checkChat) return interaction.reply({
            content: 'Kanal bulunamadı. Bir yetkiliye ulaşın.',
            ephemeral: true
        });

        if(!checkUser?.aboutMe) return interaction.reply({
            content: 'Henüz bir biyografi ayarlamadınız.',
            ephemeral: true
        });

        user1 ? await client.channels.cache.get(checkChat.user2_channel).send(`Eşleştiğiniz kullanıcı, size biyografisini gösterdi: \`\`\`${checkUser?.aboutMe}\`\`\``) : await client.channels.cache.get(checkChat.user1_channel).send(`Eşleştiğiniz kullanıcı, size biyografisini gösterdi: \`\`\`${checkUser?.aboutMe}\`\`\``);
        await interaction.reply({
            content: 'Karşı kullanıcıya biyografiniz gösterildi.',
            ephemeral: true
        });

    }
}