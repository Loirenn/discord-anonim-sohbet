const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');
module.exports = {
    name: "sonlandır",
    description: "Bulunduğunuz sohbeti sonlandırın.",
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

        user1 ? await client.channels.cache.get(checkChat.user1_channel).send(`Kanal siliniyor..`) : await client.channels.cache.get(checkChat.user2_channel).send(`Kanal siliniyor..`)
        user1 ? await client.channels.cache.get(checkChat.user2_channel).send(`Karşı kullanıcı sohbeti sonlandırdı. Kanal siliniyor..`) : await client.channels.cache.get(checkChat.user1_channel).send(`Karşı kullanıcı sohbeti sonlandırdı. Kanal siliniyor..`);

        setTimeout(async () => {
            await client.channels.cache.get(checkChat.user1_channel).delete();
            await client.channels.cache.get(checkChat.user2_channel).delete();
            await chat.deleteOne({ $or: [{ user1: interaction.user.id }, { user2: interaction.user.id }] });
            await user.updateOne({ id: checkUser.id }, { $set: { isChat: false }}, { upsert: true });
            await user.updateOne({ id: checkUser2.id }, { $set: { isChat: false }}, { upsert: true });
        }, 3000);

    }
}