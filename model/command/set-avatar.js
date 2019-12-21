const Logger = require('@elian-wonhalf/pretty-logger');
const Guild = require('../guild');

/**
 * @param {Message} message
 * @param {Array} args
 */
module.exports = {
    aliases: ['setavatar'],
    process: async (message, args) => {
        const member = await Guild.getMemberFromMessage(message);

        if (Guild.isMemberMod(member)) {
            global.bot.user.setAvatar(args.join(' ')).then(() => {
                message.reply('mon avatar a été changé !')
            }).catch((error) => {
                message.reply('il y a eu une erreur durant le changement de mon avatar. Demandez à Lily de regarder !');
                Logger.exception(error);
            });
        }
    }
};
