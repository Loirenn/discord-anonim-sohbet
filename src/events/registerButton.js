const { Modal, TextInputComponent, SelectMenuComponent, showModal } = require('discord-modals');

module.exports = (client, config) => {
    client.on('interactionCreate', (interaction) => {
        if (interaction.type !== "MESSAGE_COMPONENT") return;
        if (interaction.componentType !== "BUTTON") return;
        if (interaction.customId !== "user-register") return;

        
        const modal = new Modal()
        .setCustomId("register-modal")
        .setTitle("Anonim Chat | Kayıt ol")
        .addComponents(
            new TextInputComponent()
            .setLabel("Takma ad")
            .setCustomId('userName')
            .setStyle("SHORT")
            .setPlaceholder("Anonim chatlerde gözükecek adın.")
            .setRequired(true),
            new SelectMenuComponent()
            .setCustomId('userGender')
            .setPlaceholder('Cinsiyetin nedir?')
            .addOptions(
              {
                label: "Kadın",
                description: "Cinsiyetin kadın ise bunu seç.",
                value: "girl",
                emoji: "👩"
              },
              {
                label: "Erkek",
                description: "Cinsiyetin erkek ise bunu seç.",
                value: "man",
                emoji: "👨"
              }
            )
          );

          showModal(modal, {
            client: client,
            interaction: interaction
          });

      });
  };