const axios = require("axios").default;
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class AnimalImage extends BaseCommand {
    constructor() {
        super('animalimage', 'animal', ['animal']);
    }

    run(client, message, args) {

        if (!args[0]) return;

        const options = {
            method: 'GET',
            url: `https://some-random-api.ml/animal/${args.join(' ')}`,
        };

        axios.request(options).then(response => {
            let animalEmbed = new MessageEmbed()
                .setColor(`RANDOM`)
                .setImage(response.data.image);
            return message.channel.send(animalEmbed);
        }).catch(err => {
            return message.channel.send(":x: Sorry, we don't have any images for that animal.");
        });
    }
}