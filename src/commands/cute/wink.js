const { api } = require("some-random-api");
const config = require('../../config.json');
const PREFIX = config["bot-prefix"];

module.exports = {
    run: async (client, message, args) => {
        api.animu.wink().then(res => {
            let winkEmbed = {
                description: `**<@!${message.author.id}> winks ${args}! :wink:**`,
                color: `RANDOM`,
                image: {
                    url: res.link
                },
                timestamp: new Date()
            }
            if (args == `${PREFIX}wink`) winkEmbed.description = `**<@!${message.author.id}> winks at himself?**`;
            return message.channel.send({ embed: winkEmbed });
        }).catch(err => {
            message.channel.send(":x: Unfortunately, something went wrong with the API, and you could not wink at your love :cry:");
        });
    },
    aliases: [],
    description: 'Winks at a member'
}