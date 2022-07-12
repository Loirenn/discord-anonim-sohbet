const db = require('../models/user.js');

module.exports = (client, config) => {
    client.on('modalSubmit', async (modal) => {
        if (modal.customId !== "register-modal") return;
        
        const userName = modal.getTextInputValue('userName');
        const userGender = modal.getSelectMenuValues('userGender');
        const checkUserName = await db.findOne({ username: userName }).lean();

        if(checkUserName) return modal.reply({
            content: 'Bu kullanıcı adı başka bir kullanıcı tarafından alınmış. Lütfen başka bir kullanıcı adı deneyin.',
            ephemeral: true
        });

        await db.updateOne({ id: modal.user.id }, { $set: { username: userName, gender: userGender[0] }}, { upsert: true });
        await modal.reply({
           content: 'Başarılı bir şekilde kayıt oldunuz. Sohbete başlayabilirsiniz.',
           ephemeral: true
        });

      });
  };