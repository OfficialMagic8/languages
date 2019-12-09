const http = require('http');
const express = require('express');
const app = express();
var child_process = require('child_process');
var d = Date(Date.now());
let date = d.toString()
app.get("/", (request, response) => {
    console.log(date + " Ping Received");
    response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 900000);

const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const Enmap = require('enmap')
const fs = require("fs");
const bot = new Discord.Client();

const botStats = {
    totalGuildsID: '652539034404519936',
    totalUsersID: '652538780376367104',
};

global.EnmapEChannelIDDb = new Enmap({
    name: "echannelid"
});
global.EnmapOChannelIDDb = new Enmap({
    name: "ochannelid"
});

global.EnmapRepliesDb = new Enmap({
    name: "replynumber"
});

//----------------------------------------------------------

bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("There are no commands to load...");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
})

//----------------------------------------------------------

bot.commands = new Discord.Collection();

bot.on("ready", async () => {

    bot.user.setStatus("online")

    // Maintenance Line
    // bot.user.setActivity(`UPDATES UNDERWAY, POSSIBLE ERRORS`)

    let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()
    let log = bot.channels.get(botconfig.otherlogs)
    let logmsg = "`" + `${timechange} [READY]: From restart or edit` + "`"

    log.send(logmsg)

    bot.user.setActivity(`m*help | ${bot.guilds.size} servers`);

    let statuses = ["with your mind!", `m*help | ${bot.guilds.size} servers`]

    setInterval(function () {

        let status = statuses[Math.floor(Math.random() * statuses.length)];

        bot.user.setActivity(status)
    }, 10000)

    console.log("Ready with " + bot.guilds.size + " servers. " + bot.users.size + " users. " + bot.channels.size + " channels.")
});

bot.on("channelDelete", async channel => {

    let theEchannelid = EnmapEChannelIDDb.get(`${channel.guild.id}`, "echannelid")

    if (channel.id === theEchannelid) {

        EnmapEChannelIDDb.delete(channel.guild.id)

        const eChannel = EnmapEChannelIDDb.set(channel.guild.id, {
            echannelid: 0,
            id: channel.guild.id
        });
        await EnmapEChannelIDDb.inc(channel.guild.id, "echannelid");
    }

    let theOchannelid = EnmapEChannelIDDb.get(`${channel.guild.id}`, "ochannelid")

    if (channel.id === theOchannelid) {

        EnmapOChannelIDDb.delete(channel.guild.id)

        const oChannel = EnmapOChannelIDDb.set(channel.guild.id, {
            ochannelid: 0,
            id: channel.guild.id
        });
        await EnmapOChannelIDDb.inc(channel.guild.id, "ochannelid");
    }
});

bot.on("message", message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    if (!EnmapEChannelIDDb.has(`${message.guild.id}`)) {
        const eChannel = EnmapEChannelIDDb.set(message.guild.id, {
            echannelid: 0,
            id: message.guild.id
        });
        EnmapEChannelIDDb.inc(message.guild.id, "echannelid");
    }

    if (!EnmapOChannelIDDb.has(`${message.guild.id}`)) {
        const oChannel = EnmapOChannelIDDb.set(message.guild.id, {
            ochannelid: 0,
            id: message.guild.id
        });
        EnmapOChannelIDDb.inc(message.guild.id, "ochannelid");
    }

    if (!EnmapRepliesDb.has(`${message.guild.id}`)) {
        const guildReplies = EnmapRepliesDb.set(message.guild.id, {
            replynumber: 1,
            id: message.guild.id
        });
        EnmapRepliesDb.inc(message.guild.id, "replynumber");
    }



    let theEchannelid = EnmapEChannelIDDb.get(`${message.guild.id}`, "echannelid")

    if (theEchannelid !== 1) {

        if (message.content.startsWith("m*8ball")) {

            if (message.channel.id !== theEchannelid) {

                let embed = new Discord.RichEmbed()
                    .setColor("#ff0000")
                    .setDescription("**ERROR:** There is a set channel for `8ball`, please go to <#" + theEchannelid + "> to use the command!")
                    .setTimestamp()
                    .setFooter("Join support @ discord.gg/MCRbYdc - Magic8")

                message.channel.send(embed).then(msg => msg.delete(30000))

                message.delete();
                return;
            }
        }
    }

    let theOchannelid = EnmapOChannelIDDb.get(`${message.guild.id}`, "ochannelid")

    if (theOchannelid !== 1) {

        if (message.content.startsWith("m*odds")) {

            if (message.channel.id !== theOchannelid) {

                let embed = new Discord.RichEmbed()
                    .setColor("#ff0000")
                    .setDescription("**ERROR:** There is a set channel, please go to <#" + theOchannelid + "> to use **Magic8**.")
                    .setTimestamp()
                    .setFooter("Join support @ discord.gg/MCRbYdc - Magic8")

                message.channel.send(embed).then(msg => msg.delete(30000))

                message.delete();
                return;
            }
        }
    }

    let prefix = botconfig.prefix;

    if (!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase()
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);
});

//----------------------------------------------------------

bot.on("guildMemberAdd", async member => {


    bot.channels.get(botStats.totalGuildsID).setName(`Total Guilds : ${bot.guilds.size}`);
    bot.channels.get(botStats.totalUsersID).setName(`Total Users : ${bot.users.size}`);

    if (member.guild.id !== "610816275580583936") return;
    let welcomelogs = bot.channels.get("627864514444001280")

    let welcomeEmbed = new Discord.RichEmbed()

        .setColor("#00ff00")
        .setDescription(member + " joined")
        .setTimestamp()

    welcomelogs.send(welcomeEmbed)
});

bot.on("guildMemberRemove", async member => {


    bot.channels.get(botStats.totalGuildsID).setName(`Total Guilds : ${bot.guilds.size}`);
    bot.channels.get(botStats.totalUsersID).setName(`Total Users : ${bot.users.size}`);

    if (member.guild.id !== "610816275580583936") return;
    let welcomelogs = bot.channels.get("627864514444001280")

    let leaveEmbed = new Discord.RichEmbed()

        .setColor("#ff0000")
        .setDescription(member + " left")
        .setTimestamp()

    welcomelogs.send(leaveEmbed)
});


bot.on("guildCreate", guild => {

    bot.user.setActivity(`m*help | ${bot.guilds.size} servers`);

    const echannel = EnmapEChannelIDDb.set(guild.id, {
        echannelid: 0,
        id: guild.id
    });
    EnmapEChannelIDDb.inc(guild.id, "echannelid");

    const ochannel = EnmapOChannelIDDb.set(guild.id, {
        ochannelid: 0,
        id: guild.id
    });
    EnmapOChannelIDDb.inc(guild.id, "ochannelid");

    const guildReplies = EnmapRepliesDb.set(guild.id, {
        replynumber: 1,
        id: guild.id
    });
    EnmapRepliesDb.inc(guild.id, "replynumber");

    let bots = guild.members.filter(member => member.user.bot).size;
    let users = guild.members.filter(member => !member.user.bot).size;
    let channels = guild.channels.size;

    let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()

    let cdate = guild.createdAt.toString().split(' ');

    let changeMessage = ("`" + `${timechange} [GUILD.JOIN]: Guild: '${guild.name}', ID: '${guild.id}', Created: ${cdate[1]}, ${cdate[2]} ${cdate[3]} | (${users}/${bots}/${channels})` + "`")
    let log = bot.channels.get(botconfig.guildlogs)

    log.send(changeMessage)
});

bot.on('guildDelete', guild => {

    bot.user.setActivity(`with your mind | *help | ${bot.guilds.size} servers`)

    EnmapOChannelIDDb.delete(guild.id)
    EnmapEChannelIDDb.delete(guild.id)

    let cdate = guild.createdAt.toString().split(' ');

    let bots = guild.members.filter(member => member.user.bot).size;
    let users = guild.members.filter(member => !member.user.bot).size;
    let channels = guild.channels.size;

    let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()

    let changeMessage = ("`" + `${timechange} [GUILD.LEFT]: Guild: '${guild.name}', ID: '${guild.id}', Created: ${cdate[1]}, ${cdate[2]} ${cdate[3]} | (${users}/${bots}/${channels})` + "`")
    let log = bot.channels.get(botconfig.guildlogs)

    log.send(changeMessage)
});

bot.login(process.env.TOKEN);