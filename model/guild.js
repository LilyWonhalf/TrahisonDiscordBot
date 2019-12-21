const Config = require('../config.json');
const Logger = require('@elian-wonhalf/pretty-logger');
const Discord = require('discord.js');

const Guild = {
    /** {Guild} */
    discordGuild: null,

    /** {TextChannel} */
    generalChannel: null,

    /** {TextChannel} */
    vocalTextChannel: null,

    /** {TextChannel} */
    botChannel: null,

    init: async () => {
        Guild.discordGuild = bot.guilds.find(guild => guild.id === Config.guild);
        Guild.generalChannel = Guild.discordGuild.channels.find(channel => channel.id === Config.channels.general);
        Guild.vocalTextChannel = Guild.discordGuild.channels.find(channel => channel.id === Config.channels.vocalText);
        Guild.botChannel = Guild.discordGuild.channels.find(channel => channel.id === Config.channels.bot);
    },

    /**
     * @param message
     * @returns {GuildMember|null}
     */
    getMemberFromMessage: async (message) => {
        let member = null;

        try {
            member = await Guild.discordGuild.fetchMember(message.author, false);
        } catch (exception) {
            Logger.error(exception.toString());
        }

        return member;
    },

    /**
     * @param {string} roleName
     * @returns {Role|null}
     */
    getRoleByName: (roleName) => {
        return roleName === undefined || roleName === null ? null : Guild.discordGuild.roles.find(
            role => role.name.toLowerCase() === roleName.toLowerCase()
        );
    },

    /**
     * @param {Message} message
     * @returns {Discord.RichEmbed}
     */
    messageToEmbed: async (message) => {
        const member = await Guild.getMemberFromMessage(message);
        const suffix = member !== null && member.nickname !== null ? ` aka ${member.nickname}` : '';

        return new Discord.RichEmbed()
            .setAuthor(
                `${message.author.username}#${message.author.discriminator}${suffix}`,
                message.author.displayAvatarURL
            )
            .setColor(0x00FF00)
            .setDescription(message.content);
    },

    /**
     * @param {Message} message
     * @returns {{certain: boolean, foundMembers: Array}}
     */
    findDesignatedMemberInMessage: (message) => {
        let foundMembers = [];
        let certain = true;

        if (message.mentions.members.array().length > 0) {
            foundMembers = message.mentions.members.array();
        } else if (message.content.match(/[0-9]{18}/) !== null) {
            const ids = message.content.match(/[0-9]{18}/);

            ids.map(id => {
                if (message.guild.members.has(id)) {
                    foundMembers.push(message.guild.members.get(id));
                }
            });
        } else {
            const memberList = message.guild.members.array();

            certain = false;
            memberList.forEach(member => {
                const nickname = member.nickname !== null ? `${member.nickname.toLowerCase()}#${member.user.discriminator}` : '';
                const username = `${member.user.username.toLowerCase()}#${member.user.discriminator}`;
                const content = message.cleanContent.toLowerCase().split(' ').splice(1).join(' ');

                if (content.length > 0) {
                    const contentInNickname = nickname !== '' ? nickname.indexOf(content) > -1 : false;
                    const contentInUsername = username.indexOf(content) > -1;
                    const nicknameInContent = nickname !== '' ? content.indexOf(nickname) > -1 : false;
                    const usernameInContent = content.indexOf(username) > -1;

                    if (contentInNickname || contentInUsername || nicknameInContent || usernameInContent) {
                        foundMembers.push(member);
                    }
                }
            });
        }

        return {
            certain,
            foundMembers
        };
    }
};

module.exports = Guild;