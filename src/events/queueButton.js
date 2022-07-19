const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');

module.exports = (client, config) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.type !== "MESSAGE_COMPONENT") return;
        if (interaction.componentType !== "BUTTON") return;
        if (interaction.customId !== "user-queue") return;

        let $ = await queue.find({}).lean();
        $ = $.filter(x => x.discordID !== interaction.user.id);
        let random = $[Math.floor(Math.random() * $.length)];
        let checkUser = await user.findOne({ id: interaction.user.id });
        let checkRandomUser = await user.findOne({ id: random?.discordID });

        if(!checkUser) return interaction.reply({
            content: 'Sıraya girmek için kayıt olmalısınız.',
            ephemeral: true
        });

        if(checkUser?.isQueue) return interaction.reply({
            content: 'Zaten sıradasınız.',
            ephemeral: true
        });

        if(checkUser?.isChat) return interaction.reply({
            content: 'Zaten sohbettesiniz.',
            ephemeral: true
        });

        if(checkUser?.isBanned) return interaction.reply({
            content: 'Anonim sohbetten yasaklanmışsınız.',
            ephemeral: true
        });

        await user.updateOne({ id: checkUser.id }, { $set: { isQueue: true }}, { upsert: true });
        new queue({
            nickname: checkUser.username,
            discordID: interaction.user.id,
            discordTag: interaction.user.tag,
        }).save();

        await interaction.reply({
            content: !random ? "Şu anda bir sıra aranıyor.. Sıra bulunduğunda size bir oda açacağız. **(1/2)**" : "Şu anda bir sıra aranıyor.. Sıra bulunduğunda size bir oda açacağız. **(2/2)**",
            ephemeral: true,
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel("Aramayı durdur")
                    .setStyle("DANGER")
                    .setEmoji("📏")
                    .setCustomId("user-queue-cancel")
                )
            ]
        });

        async function startChat() {
            if(!random) return;

            await interaction.editReply({
                content: 'Sıra başarıyla bulundu!'
            });

            if(random?.isChat) {
                await interaction.reply({
                    content: 'Eşleştiğiniz kişi zaten bir sohbette. Lütfen tekrar sıraya girin.',
                    ephemeral: true
                });
                await user.updateOne({ id: checkUser.id }, { $set: { isQueue: false }}, { upsert: true });
                await queue.deleteOne({ discordID: interaction.user.id });
                return;
            };

            let genID = generateId(5);

            let channel_1 = await interaction.guild.channels.create(`chat-${genID}`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                        deny: ['ATTACH_FILES']
                    },
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }
                ]
            });

            let channel_2 = await interaction.guild.channels.create(`chat-${genID}`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: random.discordID,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                        deny: ['ATTACH_FILES']
                    },
                    {
                        id: interaction.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }
                ]
            });

            await channel_1.send({
               content: `<@${interaction.user.id}>`,
               embeds: [
                new MessageEmbed()
                .setColor("BLURPLE")
                .setDescription(`🕵️ **|** ${random.nickname} kullanıcısı ile bir eşleşme yakaladınız.\n📪 **|** Kullanıcı durumu: **${checkRandomUser?.reported < 10 ? "💚 Güvenilir gözüküyor." : "❤️ Kullanıcı güvenilir değil."}**`)
               ] 
            });

            await channel_2.send({
                content: `<@${random.discordID}>`,
                embeds: [
                 new MessageEmbed()
                 .setColor("BLURPLE")
                 .setDescription(`🕵️ **|** ${checkUser.username} kullanıcısı ile bir eşleşme yakaladınız.\n📪 **|** Kullanıcı durumu: **${checkUser?.reported < 10 ? "💚 Güvenilir gözüküyor." : "❤️ Kullanıcı güvenilir değil."}**`)
                ] 
             });

            new chat({
                user1: interaction.user.id,
                user2: random.discordID,
                user1_channel: channel_1.id,
                user2_channel: channel_2.id,
                code: genID
            }).save(); //1 = interaction 2 = random user

            await queue.deleteOne({ discordID: interaction.user.id });
            await queue.deleteOne({ discordID: random.discordID });
            await user.updateOne({ id: random.discordID }, { $set: { isQueue: false, isChat: true }}, { upsert: true });
            await user.updateOne({ id: interaction.user.id }, { $set: { isQueue: false, isChat: true }}, { upsert: true });

        };

        startChat();

        
      });
  };

 function generateId(length) {
    let result = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
