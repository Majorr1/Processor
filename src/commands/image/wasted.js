const { MessageEmbed, MessageAttachment } = require('discord.js')
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class Wasted extends BaseCommand {
    constructor() {
        super('wasted', 'image', []);
    }

    async run(client, message, args) {
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let link = `https://some-random-api.ml/canvas/wasted/?avatar=${mentionedMember.avatarURL({ format: 'png' })}`

        let attachment = new MessageAttachment(link, 'wasted.png');
        message.channel.send(attachment);
    }
}