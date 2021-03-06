const guildPrefixes = {};
const fs = require('fs');
const path = require('path');
const { prefix: globalPrefix } = require('../../config.json');
const commandPrefixSchema = require('../../schemas/command-prefix-schema');
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class Help extends BaseCommand {
    constructor() {
        super('help', 'info', []);
    }

    async run(client, message, args) {
        let page = 1;
        let maxPages = 9;

        let setupCmds = [];
        let modCmds = [];
        let mathCmds = [];
        let animalCmds = [];
        let clashCmds = [];
        let cuteCmds = [];
        let infoCmds = [];
        let otherCmds = [];

        let setupCmdNames = fs.readdirSync(path.join(__dirname, '../setup'));
        let modCmdNames = fs.readdirSync(path.join(__dirname, '../mod'));
        let mathCmdNames = fs.readdirSync(path.join(__dirname, '../math'));
        let animalCmdNames = fs.readdirSync(path.join(__dirname, '../animal'));
        let clashCmdNames = fs.readdirSync(path.join(__dirname, '../clash'));
        let cuteCmdNames = fs.readdirSync(path.join(__dirname, '../cute'));
        let infoCmdNames = fs.readdirSync(path.join(__dirname, '../info'));
        let otherCmdNames = fs.readdirSync(path.join(__dirname, '../other'));

        setupCmdNames.forEach(cmd => {
            cmd = cmd.slice(0, cmd.indexOf('.js'));
            setupCmds.push(cmd);
        });
        modCmdNames.forEach(cmd => {
            cmd = cmd.slice(0, cmd.indexOf('.js'));
            modCmds.push(cmd);
        });
        mathCmdNames.forEach(cmd => {
            cmd = cmd.slice(0, cmd.indexOf('.js'));
            mathCmds.push(cmd);
        });
        animalCmdNames.forEach(cmd => {
            cmd = cmd.slice(0, cmd.indexOf('.js'));
            animalCmds.push(cmd);
        });
        clashCmdNames.forEach(cmd => {
            cmd = cmd.slice(0, cmd.indexOf('.js'));
            clashCmds.push(cmd);
        });
        cuteCmdNames.forEach(cmd => {
            cmd = cmd.slice(0, cmd.indexOf('.js'));
            cuteCmds.push(cmd);
        });
        infoCmdNames.forEach(cmd => {
            cmd = cmd.slice(0, cmd.indexOf('.js'));
            infoCmds.push(cmd);
        });
        otherCmdNames.forEach(cmd => {
            cmd = cmd.slice(0, cmd.indexOf('.js'));
            otherCmds.push(cmd);
        });

        for (const guild of client.guilds.cache) {
            const result = await commandPrefixSchema.findOne({ _id: message.guild.id });
            if (result == null) {
                guildPrefixes[message.guild.id] = globalPrefix;
            }
            else {
                guildPrefixes[message.guild.id] = result.prefix;
            }
        }
        const PREFIX = guildPrefixes[message.guild.id] || globalPrefix;

        let helpClosed = new MessageEmbed()
            .setColor('ORANGE')
            .setTitle(`Help Closed`)
            .setDescription('Deleting this embed in 5 seconds...');

        let helpFallbackEmbed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle('Need some help?')
            .setDescription(`Prefix is **${PREFIX}** as in **${PREFIX}help**.\n{required} [optional]`)
            .addField(':wrench: Setup  `setup`', 'Configure the bot in your server. `Manage Server` permission is required.')
            .addField(':shield: Moderation  `mod`', 'Manages server members.')
            .addField(':cat: Animal  `animal`', 'Learn about animals.')
            .addField(':crossed_swords: Clash  `clash`', 'Look up Clash of Clans related things.')
            .addField(':blue_heart: Cute  `cute`', 'Adore a member.')
            .addField(':1234: Math  `math`', 'Play with numbers.')
            .addField(':information_source: Info  `info`', 'Get information about a user or the server.')
            .addField(':o: Other  `other`', 'Play with other commands.')

        let helpEmbed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle('Need some help?')
            .setDescription(`Prefix is **${PREFIX}** as in **${PREFIX}help**.\n{required} [optional]`)
            .addField(':wrench: Setup', 'Configure the bot in your server. `Manage Server` permission is required.')
            .addField(':shield: Moderation', 'Manages server members.')
            .addField(':cat: Animal', 'Learn about animals.')
            .addField(':crossed_swords: Clash', 'Look up Clash of Clans related things.')
            .addField(':blue_heart: Cute', 'Adore a member.')
            .addField(':1234: Math', 'Play with numbers.')
            .addField(':information_source: Info', 'Get information about a user or the server.')
            .addField(':o: Other', 'Play with other commands.')

        let setupEmbed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle('Setup Commands')
            .setDescription(`Only members with the \`Manage Server\` permission such as mod or admin, can use these commands. \n\n\`${setupCmds.join('\n')}\``)

        let modEmbed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle('Moderation Commands')
            .setDescription(`\`${modCmds.join('\n')}\``)

        let mathEmbed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle('Math Commands')
            .setDescription(`\`${mathCmds.join('\n')}\``)

        let animalEmbed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle('Animal Commands')
            .setDescription(`\`${animalCmds.join('\n')}\``)

        let clashEmbed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle('Clash Commands')
            .setDescription(`\`${clashCmds.join('\n')}\``)

        let cuteEmbed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle('Cute Commands')
            .setDescription(`\`${cuteCmds.join('\n')}\``)

        let infoEmbed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle('Info Commands')
            .setDescription(`Prefix is **${PREFIX}** as in **${PREFIX}help**.`)
            .setDescription(`\`${infoCmds.join('\n')}\``)

        let otherEmbed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle('Info Commands')
            .setDescription(`\`${otherCmds.join('\n')}\``)

        let allEmbeds = [helpEmbed, setupEmbed, modEmbed, animalEmbed, clashEmbed, cuteEmbed, mathEmbed, infoEmbed, otherEmbed];

        function gotoPage(msg, page) {
            for (let i = 0; i < maxPages + 1; i++) {
                switch (page) {
                    case i:
                        allEmbeds[i - 1].setFooter(`Page ${page} of ${maxPages}`, `${message.author.displayAvatarURL()}`);
                        msg.edit(allEmbeds[i - 1]);
                        break;
                }
            }
            changePage(msg);
        }

        function changePage(msg) {
            msg.react('⏮')
                .then(msg.react('◀'))
                .then(msg.react('💠'))
                .then(msg.react('▶'))
                .then(msg.react('⏭'))
                .then(msg.react('788157446178340915'))


            const filter = (reaction, user) => {
                return ['⏮', '◀', '💠', '▶', '⏭', 'no'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            msg.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();

                    switch (reaction.emoji.name) {
                        case '⏮':
                            page = 1;
                            gotoPage(msg, 1);
                            break;
                        case '◀':
                            if (page <= 1) {
                                page = 1;
                            }
                            else {
                                page--;
                            }
                            gotoPage(msg, page);
                            break;
                        case '💠':
                            if (page == Math.round(maxPages / 2)) {
                                page = Math.round(maxPages / 2);
                            }
                            else {
                                page = Math.round(maxPages / 2);
                            }
                            gotoPage(msg, page);
                            break;
                        case '▶':
                            if (page >= maxPages) {
                                page = maxPages;
                            }
                            else {
                                page++;
                            }
                            gotoPage(msg, page);
                            break;
                        case '⏭':
                            page = maxPages;
                            gotoPage(msg, maxPages);
                            break;
                        case 'no':
                            return msg.edit(helpClosed)
                                .then(close => {
                                    close.delete({ timeout: 5000 });
                                });
                    }
                })
                .catch(err => {
                    return msg.delete();
                })
        }
        switch (args[0]) {
            case "setup":
                return message.channel.send(setupEmbed);
            case "mod":
                return message.channel.send(modEmbed);
            case "animal":
                return message.channel.send(animalEmbed);
            case "clash":
                return message.channel.send(clashEmbed);
            case "cute":
                return message.channel.send(cuteEmbed);
            case "math":
                return message.channel.send(mathEmbed);
            case "info":
                return message.channel.send(infoEmbed);
            case "other":
                return message.channel.send(otherEmbed);
        }

        if (!message.guild.me.hasPermission(["READ_MESSAGE_HISTORY", "ADD_REACTIONS"])) {
            message.channel.send(`:grey_question: If you wish to use reactions to navigate the help menu, please make make the following permissions are enabled:\n**Read Messages\nAdd Reactions**\nUsage: ${PREFIX}help \`[topic]\``);
            return message.channel.send(helpFallbackEmbed);
        }
        helpEmbed.setFooter(`Page ${page} of ${maxPages}`, `${message.author.displayAvatarURL()}`);
        message.channel.send(helpEmbed).then(msg => {
            changePage(msg);
        });
    }
}