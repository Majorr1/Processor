const { MessageEmbed } = require('discord.js');
const warnSchema = require('../../schemas/warn-schema');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class Unwarn extends BaseCommand {
    constructor() {
        super('unwarn', 'mod', ['unw', 'uw']);
    }

    async run(client, message, args) {
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.channel.send('You need to `Message Messages` permission to unwarn a member.');
        }

        if (!mentionedMember) {
            return message.channel.send('You need to mention a member you want to warn');
        }

        const mentionedPosition = mentionedMember.roles.highest.position;
        const memberPosition = message.member.roles.highest.position;

        if (memberPosition <= mentionedPosition) {
            return message.channel.send("You can't unwarn this member as their role is higher than or equal to yours.");
        }

        const reason = args.slice(2).join(' ')

        const warnDoc = await warnSchema.findOne({
            guildId: message.guild.id,
            memberId: mentionedMember.id,
        }).catch(err => console.log(err));

        if (!warnDoc || !warnDoc.warnings.length) {
            return message.channel.send("This member has a clean slate!");
        }

        const warningId = parseInt(args[1])

        if (warningId < 0 || warningId > warnDoc.warnings.length) {
            return message.channel.send('Invalid warning ID.');
        }

        warnDoc.warnings.splice(warningId - 1, warningId !== 1 ? warningId - 1 : 1);
        await warnDoc.save().catch(err => console.log(err));

        message.channel.send(new MessageEmbed()
            .setDescription(`Unwarned ${mentionedMember} ${reason ? `for **${reason}**` : ''}`)
            .setColor('DARK_GOLD')
        );
    }
}