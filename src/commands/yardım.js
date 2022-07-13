const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const user = require('../models/user');
const queue = require('../models/queue');
const chat = require('../models/chat');
module.exports = {
    name: "yardım",
    description: "Bot hakkında bilgi öğrenin.",
    options: [],
    perms: {
      user:  []
  },
    run: async (client, interaction) => {

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor("BLURPLE")
                .setAuthor({ name: "Açık kaynak Anonim sohbet botu", iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setTitle("💖 Loiren")
                .setURL("https://loiren.xyz")
                .setDescription(`> Botu kullandığınız için teşekkür ederim. Bu bot, bir açık kaynak botudur. Sunucudaki kullanıcılarınızın anonim sohbet etmesini sağlar.`)
                .addField("Nasıl kurarım?", '> `!register` ve `!queue` komutlarını kullanarak chate kayıt ve sıra butonlarını attırabilirsiniz. İlk olarak, kullanıcıların "Kayıt ol" butonundan kayıt olması gerekiyor. Daha sonra rahatça sıra arayabilirler.')
                .setFooter({ text: "Developed by Loiren", iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setTimestamp()
            ],
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel("Kaynak kodu")
                    .setURL("https://github.com/Loirenn/discord-anonim-sohbet/")
                    .setStyle("LINK")
                )
            ]
        });
       
    }
}
