module.exports = (client, config) => {
    client.on('ready', () => {
        
        client.user.setStatus('online');
        client.user.setActivity("💖 Loiren", { type: "PLAYING" });
      })
  };