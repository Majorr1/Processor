const { api } = require("some-random-api");
const PREFIX = process.env.PREFIX;
const fs = require('fs');

module.exports = {
    run: async (client, message, args) => {

        let bannedWords = fs.readFileSync('./events/bannedwords.txt').toString().split("\r\n");
        let bannedPhrases = fs.readFileSync('./events/bannedphrases.txt').toString().split("\r\n");

        if (args == `${PREFIX}lyrics`) {
            message.reply(":memo: **What song's lyrics do you want?**")
                .then(msg => {
                    msg.delete({ timeout: 4000 });
                });
            return;
        }
        else {
            api.other.lyrics(args).then(res => {
                // Checks if parameter is an nsfw term. Blocks command in non-nsfw channels.
                if (!message.channel.nsfw) {
                    for (let i = 0; i < bannedWords.length; i++) {
                        if (res.lyrics == bannedWords[i]) return message.channel.send(`${res.title} contains NSFW lyrics (${bannedWords[i]}). Please visit an NSFW channel to view this song's lyrics.`);
                    }

                    for (let j = 0; j < bannedPhrases.length; j++) {
                        if (res.lyrics.includes(bannedPhrases[j])) return message.channel.send(`${res.title} contains NSFW lyrics (${bannedPhrases[j]}). Please visit an NSFW channel to view this song's lyrics.`);
                    }
                }
                let lyricsEmbed = {
                    title: `${res.title} by ${res.author}`,
                    color: `RANDOM`,
                    description: res.links.genius,
                    timestamp: new Date()
                }
                return message.channel.send({ embed: lyricsEmbed });
            });
        }
    },
    aliases: ['lyric'],
    description: 'Shows the name and a link to the song lyrics'
}