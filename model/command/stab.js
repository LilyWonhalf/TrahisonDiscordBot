const Guild = require('../guild');

/**
 * @param {Message} message
 */
module.exports = {
    aliases: ['st'],
    process: async (message) => {
        const search = Guild.findDesignatedMemberInMessage(message);

        if (search.foundMembers.length > 0) {
            await message.delete();

            const stabber = search.foundMembers[0];
            const stabbees = Guild.discordGuild.members.filter(member => !member.user.bot).random(3);
            let stabbee = stabbees.shift();

            while ([stabber.id, message.author.id].includes(stabbee.id) && stabbees.length > 0) {
                stabbee = stabbees.shift();
            }

            message.channel.send(
                `Ah ! ${stabber}, je savais que tu faisais semblant d'être l'ami de ${message.author} pour pouvoir mieux te rapprocher de ${stabbee.displayName} !`
            );
        } else {
            message.reply(
                'Je n\'ai aucune idée de qui mentionner, de qui a abusé de ton amitié pour se rapprocher de quelqu\'un d\'autre. N\'oublie pas de mentionner cette personne dans la commande !'
            );
        }
    }
};
