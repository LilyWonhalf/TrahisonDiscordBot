const Logger = require('@elian-wonhalf/pretty-logger');
const Guild = require('../../model/guild');

module.exports = async () => {
    Logger.info('Logged in as ' + bot.user.username + '#' + bot.user.discriminator);

    Logger.info('--------');

    Logger.info('Syncing guilds...');
    bot.syncGuilds();
    await Guild.init();
    Logger.info('Guilds synced. Serving in ' + Guild.discordGuild.name);

    Logger.info('--------');

    if (process.argv[3] === '--reboot') {
        Guild.botChannel.send('Je suis de retour :) !');
    }
};
