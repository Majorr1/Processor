const { exists, insertGuildMember, updateGuildMemberEXP } = require('../utils/database');
const { generateEXP, checkExperience } = require("../utils/random"); 
const ms = require('ms');
const fs = require('fs');
const PREFIX = process.env.PREFIX;

module.exports = async(client, message) => {	
	client.user.setActivity(`${client.users.cache.size} members`, {type: 'WATCHING'}).catch(console.error);
	if (message.content.includes("<@&735270562544222290>")) {
		message.reply("you are about to ping all staff in the server. **Unless it's an emergency**, you will be punished for pinging this role. Reply with `call` **IN CAPS within 10 seconds** if you want to do this.");
		const filter = m => m.content.includes('CALL');
		message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
		.then(collected => {
			message.reply(`you have chosen to <@&701441802087170138>. Staff will come to address your issue urgently.`);
		})
		.catch(collected => {
			message.reply("time's up! Your staff call was declined.");
		});
	}

	if (message.author.bot) return;
	
	if (message.content == '<@!689678745782714464>') {
		return message.reply(`hi! My prefix is **${PREFIX}**. You can summon my help page using **${PREFIX}help**.`)
	}
	let bannedWords = fs.readFileSync('./events/bannedwords.txt').toString().split("\r\n");
	let bannedPhrases = fs.readFileSync('./events/bannedphrases.txt').toString().split("\r\n");
	let msg = message.content.toLowerCase();
	let wordsOnlyMsg = msg.replace(/[.?!#$%^&*,-_+=]/g, ' ');
	let words = wordsOnlyMsg.split(/\s+/);
	for (let i = 0; i < bannedWords.length; i++) { 	
		if (words.includes(bannedWords[i])) {
			//message.delete();
			// return message.reply(`you are not allowed to say that word anywhere in ${message.guild.name}.`)
			// .then(msg => {
            //     msg.delete({timeout: 10000});
            // });
		}	
	}
	for (let i = 0; i < bannedPhrases.length; i++) { 	
		if (msg.includes(bannedPhrases[i])) {
			// message.delete();
			// return message.reply(`you are not allowed to say that phrase anywhere in ${message.guild.name}.`)
			// .then(msg => {
            //     msg.delete({timeout: 10000});
            // });
		}	
	}   

	if (message.channel.id == '678326702065319968') {
		if (message.content.toLowerCase() == '!d bump') {
			message.channel.send(`**${message.author.username}**, you bumped! I'll ping you when you can bump again!`);
				setTimeout(function() {
					client.channels.cache.get('678326702065319968').send(`<@!${message.author.id}>, you can bump now!`);
					return;
				}, ms('2h'));
				return;
			}
		}	

    if(message.author.bot) return;
	if(!message.content.startsWith(PREFIX)) {
		const guildId = message.guild.id;
		const memberId = message.member.id;
		const result = (await exists(guildId, memberId))[0];
		if (result.length > 0) {
			const { experiencePoints, currentLevel } = result[0];
			const EXP = generateEXP();
			const updatedEXP = EXP + experiencePoints;
			const newLevel = checkExperience(updatedEXP, currentLevel);
			const update = await updateGuildMemberEXP(guildId, memberId, updatedEXP, newLevel);
		}
		else {
			await insertGuildMember(guildId, memberId)
				.catch((err) => console.log(err));
		}
		return;
	}
	let cmdName = message.content.substring(message.content.indexOf(PREFIX) + 1).split(new RegExp(/\s+/)).shift();
	let argsToParse = message.content.substring(message.content.indexOf(' ') + 1);

	if(client.commands.get(cmdName)) {
		client.commands.get(cmdName)(client, message, argsToParse);
	}
	else {
        // message.reply(':x: **Please enter a valid command.**')
  		// .then(msg => {
		// 	msg.delete({timeout: 4000});
		// 	setTimeout(function() {
		// 		msg.edit(':information_source: **Try running ' + `**${PREFIX}help**` + ' for all commands.**');
		// 	  }, 1500)
		// }).catch(console.error);
	}
}