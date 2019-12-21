const Guild = require('../guild');

/**
 * @param {Message} message
 */
module.exports = {
    aliases: [],
    process: async (message) => {
        const search = Guild.findDesignatedMemberInMessage(message);

        if (search.foundMembers.length > 0) {
            const member = search.foundMembers[0];
            let url = member.user.displayAvatarURL;

            if (url.indexOf('?') > -1) {
                url = url.substr(0, url.indexOf('?'));
            }

            message.channel.send({
                file: {
                    attachment: `${url}?size=2048`,
                    name: member.id + url.substr(url.lastIndexOf('.'))
                }
            });
        } else {
            message.reply(
                'Je n\'ai aucune idée de qui tu veux afficher l\'avatar'
            );
        }
    }
};
