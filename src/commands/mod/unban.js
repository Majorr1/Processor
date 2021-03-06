const userReg = RegExp(/<@!?(\d+)>/);
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class Unban extends BaseCommand {
    constructor() {
        super('unban', 'mod', ['ub', 'unb']);
    }

    async run(client, message, args) {
        const userId = userReg.test(args[0]) ? userReg.exec(args[0])[1] : args[0];
        const mentionedUser = await message.client.users.fetch(userId).catch(() => null);

        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return message.channel.send('You need the `Ban Members` permission to unban a member.');
        }
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
            return message.channel.send('I need the `Ban Members` permission to unban a member.');
        }
        if (!mentionedUser) {
            return message.channel.send('You need to mention a user to unban.');
        }

        const allBans = await message.guild.fetchBans();
        const bannedUser = allBans.get(mentionedUser.id);

        if (!bannedUser) {
            return message.channel.send('This member is not banned.');
        }

        const reason = args.slice(1).join(' ');

        message.guild.members.unban(mentionedUser.id, [reason]).catch(err => {
            message.channel.send('Failed to unban this member: ' + err);
        });

        message.channel.send(new MessageEmbed()
            .setDescription(`Unbanned ${mentionedUser} ${reason ? `for **${reason}**` : ''}`)
            .setColor('DARK_BLUE')
        );
    }
}