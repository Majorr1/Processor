
const { Client } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('./config.json');
const Topgg = require("@top-gg/sdk");
const { chalk, yellowBright, greenBright, cyanBright } = require('chalk');
//const express = require('express');
//const app = express();
const api = new Topgg.Api(config["topgg-token"]);
//const webhook = new Topgg.Webhook(config["topgg-auth"]);
const client = new Client();
//const options = new ClientOptions();
const log = console.log;


(async () => {
    await client.login(config.token).then(() => log(yellowBright('Logging In...')));
    log(greenBright('Configuring Client Settings...'));
    client.commands = new Map();
    client.events = new Map();
    client.snipes = new Map();
    client.prefix = config.prefix;
    await registerCommands(client, '../commands').then(() => log(cyanBright("Registering Commands...")));
    await registerEvents(client, '../events').then(() => log(cyanBright("Registering Events...")));

    setInterval(() => {
        api.postStats({
            serverCount: client.guilds.cache.size,
            // shardId: client.shard.ids[0], // Sharding
            shardCount: client.options.shardCount
        });
    }, 1800000) // post every 30 minutes
    console.log("Started Posting Bot Stats on top.gg.");

    // app.post('/dblwebhook', webhook.middleware(), (req, res) => {
    //     // req.vote is your vote object e.g
    //     console.log(req.vote.user) // user id
    // }) // attach the middleware

    // app.listen(3000)
    console.log('Awaiting Ready Event...');
})();

