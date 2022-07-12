const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = (client, config) => {
    client.on('messageCreate', (msg) => {
        if(msg.content === "!register") {
            msg.delete();
            msg.channel.send({
                content: 'Anonim chate katılmak için aşağıdaki butona tıklayarak kayıt olabilirsiniz.',
                components: [
                    new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setLabel("Kayıt ol")
                        .setEmoji("👁")
                        .setCustomId("user-register")
                        .setStyle("PRIMARY")
                    )
                ]
            });
        }
        if(msg.content === "!queue") {
            msg.delete();
            msg.channel.send({
                content: 'Arama sırasına girmek için aşağıdaki butona tıklayın. Bir eşleşme bulunduğunda sizin için oda açacağız.',
                components: [
                    new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setLabel("Sıraya gir")
                        .setEmoji("🧼")
                        .setCustomId("user-queue")
                        .setStyle("PRIMARY")
                    )
                ]
            });
        };
      });
  };