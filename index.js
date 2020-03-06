const http = require('http');
const express = require('express');
const app = express();

var child_process = require('child_process');
let date = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()

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


// setInterval(() => {
// let stats = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));
//   stats["8ball"].daily = 0;
//   stats["guilds"].daily = 0;

//   fs.writeFile("./stats.json", JSON.stringify(stats, null, 2), (err) => {
//     if (err) console.log(err);
//   });
//   console.log("daily stats reset")
// }, 86400000);

// setInterval(() => {
// let stats = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));
//   stats["8ball"].weekly = 0;
//   stats["guilds"].weekly = 0;

//   fs.writeFile("./stats.json", JSON.stringify(stats, null, 2), (err) => {
//     if (err) console.log(err);
//   });
//   console.log("weekly stats reset")
// }, 604800000);

let countDownDate = new Date("April 1, 2020 00:00:00").getTime() + (5 * 3600000);
// new Date(new Date().getTime() - (5 * 3600000))

let x = setInterval(function () {

    let now = new Date().getTime();

    let distance = countDownDate - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // console.log(days + "d " + hours + "h " + minutes + "m " + seconds + "s ")

    if (distance < 0) {
        let stats = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));
        stats["8ball"].monthly = 0;
        stats["guilds"].monthly = 0;

        fs.writeFile("./stats.json", JSON.stringify(stats, null, 2), (err) => {
            if (err) console.log(err);
        });
    }
}, 1000);

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

    let prefix = botconfig.prefix;

    if (!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase()
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);
});


bot.on("guildMemberAdd", async member => {
    
    bot.channels.get(botStats.totalGuildsID).setName(`Total Guilds : ${bot.guilds.size}`);
    bot.channels.get(botStats.totalUsersID).setName(`Total Users : ${bot.users.size}`);

    if (member.guild.id !== "610816275580583936") return;
    let welcomelogs = bot.channels.get("627864514444001280")

    let linebreak = "~~                                                                     ~~\n"
    let joinmsg = "<:magic8:662013341060825088> - " + member + " joined `✅`"

    welcomelogs.send(linebreak + joinmsg)
});

bot.on("guildMemberRemove", async member => {

    bot.channels.get(botStats.totalGuildsID).setName(`Total Guilds : ${bot.guilds.size}`);
    bot.channels.get(botStats.totalUsersID).setName(`Total Users : ${bot.users.size}`);

    if (member.guild.id !== "610816275580583936") return;
    let welcomelogs = bot.channels.get("627864514444001280")

    let linebreak = "~~                                                                     ~~\n"
    let leavemsg = "<:magic8:662013341060825088> - " + member + " left `❌`"

    welcomelogs.send(linebreak + leavemsg)
});

bot.on("guildCreate", guild => {

    bot.user.setActivity(`m*help | ${bot.guilds.size} servers`);

    let stats = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));

    stats["guilds"].total++;
    stats["guilds"].daily++;
    stats["guilds"].monthly++;
    stats["guilds"].weekly++;

    fs.writeFile("./stats.json", JSON.stringify(stats, null, 2), (err) => {
        if (err) console.error(err);
    });

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

    let stats = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));

    stats["guilds"].total--
    stats["guilds"].daily--;
    stats["guilds"].monthly--;
    stats["guilds"].weekly--;

    fs.writeFile("./stats.json", JSON.stringify(stats, null, 2), (err) => {
        if (err) console.error(err);
    });

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