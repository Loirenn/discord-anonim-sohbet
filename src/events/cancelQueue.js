const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');

module.exports = (client, config) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.type !== "MESSAGE_COMPONENT") return;
        if (interaction.componentType !== "BUTTON") return;
        if (interaction.customId !== "user-queue-cancel") return;

        let checkUser = await user.findOne({ id: interaction.user.id });
        if(!checkUser?.isQueue) return interaction.reply({
            content: 'Zaten sırada değilsiniz.',
            ephemeral: true
        });

        await queue.deleteOne({ discordID: interaction.user.id });
        await user.updateOne({ id: interaction.user.id }, { $set: { isQueue: false }}, { upsert: true });
        await interaction.reply({
            content: 'Sıradan başarıyla çıktınız.',
            ephemeral: true
        });

    });
  };