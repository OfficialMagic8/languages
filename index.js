const http = require('http');
const express = require('express');
const app = express();

var child_process = require('child_process');
let date = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()

var path = require('path');
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname + '/index.html'));
    response.status(200);
});

app.get("/style.css", (request, response) => {
    response.sendFile(path.join(__dirname + '/style.css'));
    response.status(200);
});

app.get("/script.js", (request, response) => {
    response.sendFile(path.join(__dirname + '/script.js'));
    response.status(200);
});

app.get("/stats.json", (request, response) => {
    response.sendFile(path.join(__dirname + '/stats.json'));
    response.status(200);
});

app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 900000);

const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const Enmap = require('enmap')
const fs = require("fs");
//---------------------------------
const bot = new Discord.Client();

const DBL = require("dblapi.js");
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4NDE0ODcwNTUwNzkzNDIwOCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTg0NTM4NTY0fQ.gA7Z9nQuGp3E7cw_IsLSGH7k1ebgWMFHoXWokvayYV8', { webhookPort: 5000, webhookAuth: 'meanBean' });

dbl.webhook.on('ready', hook => {
    console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});
dbl.webhook.on('vote', vote => {
    console.log(`User with ID ${vote.user} just voted!`);
});


global.EnmapEChannelIDDb = new Enmap({
    name: "echannelid"
});

global.EnmapRepliesDb = new Enmap({
    name: "replynumber"
});
bot.commands = new Discord.Collection();

// commands
fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    console.log("[MOD]: Loading commands...")
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`[COMMANDS]: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
})

// handlers
fs.readdir("./handlers/", (err, files) => {
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    console.log("[MOD]: Loading events...")
    jsfile.forEach((f, i) => {
        let props = require(`./handlers/${f}`);
        console.log(`[EVENTS]: ${f} loaded!`);
    });
})

bot.on("ready", async () => {

    bot.user.setStatus("online")

    // Maintenance Line
    // bot.user.setActivity(`UPDATES UNDERWAY, POSSIBLE ERRORS`)

    let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()
    let log = bot.channels.get(botconfig.otherlogs)
    let logmsg = "`" + `${timechange} [READY]: From restart or edit` + "`"

    log.send(logmsg);

    bot.user.setActivity(`m*help | ${bot.guilds.size} servers`);
    let statuses = ["with your mind!", `m*help | ${bot.guilds.size} servers`]
    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status)
    }, 10000)

    console.log("[MOD]: Status: Ready - " + bot.guilds.size + " servers - " + bot.users.size + " users - " + bot.channels.size + " channels")
});

module.exports = {
    bot: bot
};

bot.login(process.env.TOKEN);