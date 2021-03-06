const mongo = require('../features/mongo');
const logSchema = require('../schemas//logs-schema');
const BaseEvent = require('../utils/structures/BaseEvent');
const { MessageEmbed } = require('discord.js');

module.exports = class MessageDelete extends BaseEvent {
    constructor() {
        super('messageDelete');
    }
    async run(client, message) {
        if (message.author.bot) return;
        client.snipes.set(message.channel.id, {
            content: message.content,
            author: message.author.tag,
            member: message.member,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null
        });
        const logChannelQuery = await logSchema.findOne({ _id: message.guild.id });
        if (logChannelQuery == null) return;
        const logChannel = logChannelQuery.channel;
        let destination = client.channels.cache.get(logChannel.toString());

        let deletedEmbed = new MessageEmbed()
            .setTitle(`Message Deleted from ${message.author.tag}`)
            .setDescription(`**Channel:** <#${message.channel.id}>\n**Content:** ${message.content}`)
            .setColor('RED')
            .setFooter(new Date().toLocaleTimeString());

        destination.send(deletedEmbed);

    }
}