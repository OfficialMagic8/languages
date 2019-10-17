const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let maintenance = botconfig.maintenance;

    // if (message.author.id !== "292821168833036288") return message.reply(maintenance);

    if (!EnmapGuildNameCommandsDb.has(`${message.guild.id}`)) {
        const guildNameCommands = EnmapGuildNameCommandsDb.ensure(message.guild.id, {
            gncount: 0,
            id: bot.guilds.get(message.guild.id).name
        });
        EnmapGuildNameCommandsDb.inc(message.guild.id, "gncount");
    }

    if (!EnmapGuildCommandsDb.has(`${message.guild.id}`)) {
        const guildCommands = EnmapGuildCommandsDb.ensure(message.guild.id, {
            gcount: 0,
            id: message.guild.id
        });
        EnmapGuildCommandsDb.inc(message.guild.id, "gcount");
    }
    if (!EnmapGOCDb.has(`${message.guild.id}`)) {
        const goc = EnmapGOCDb.ensure(message.guild.id, {
            goc: 0,
            id: message.guild.id
        });
        EnmapGOCDb.inc(message.guild.id, "goc");
    }

    if (!EnmapGONCDb.has(`${message.guild.id}`)) {
        const gonc = EnmapGONCDb.ensure(message.guild.id, {
            gonc: 0,
            id: bot.guilds.get(message.guild.id).name
        });
        EnmapGONCDb.inc(message.guild.id, "gonc");
    }

    let playsorplay = "plays";
    let playsorplay1 = "plays";

    let noargs = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setDescription("**ERROR:** Please type `8ball` or `odds`!")
        .setTimestamp()

    if (!args[0]) return message.channel.send(noargs).then(msg => msg.delete(10000))

    if (!["odds", "8ball"].includes(args[0])) return message.channel.send(noargs).then(msg => msg.delete(10000))

        if (args[0] === "8ball") {

        let guildcommandcount = EnmapGuildNameCommandsDb.get(`${message.guild.id}`, "gncount")
        let actualcount = guildcommandcount - 1;

        if (actualcount === 1) {
            playsorplay1 = "play"
        }
        if (actualcount === 0) {
            playsorplay1 = "plays"
        }
        if (actualcount !== 0) {
            playsorplay1 = "plays"
        }

        const filtered = EnmapGuildNameCommandsDb.array()

        const sorted = filtered.sort((a, b) => b.gncount - a.gncount);

        let rank = 0;
        for (let i = 0; i < sorted.length; i++) {
            let guildn = bot.guilds.get(sorted[i].id)
            if (sorted[i].id === message.guild.name) {
                rank = i;
            }
        }

        const top10 = sorted.splice(1, 9);

        const firstplace = sorted.splice(0, 1);

        let otherwinners;
        let i = 2;
        for (const data of top10) {
            if (data.gncount - 1 === 1) {
                playsorplay = "play"
            }
            if (data.gncount - 1 === 0) {
                playsorplay = "plays"
            }
            if (data.gncount - 1 !== 0) {
                playsorplay = "plays"
            }
            otherwinners += `**${i}:** "${data.id}" with **${data.gncount-1}** ${playsorplay}!\n`;
            i++;
            otherwinners = otherwinners.replace(/undefined/, '');
        }

        let number1;
        for (const data1 of firstplace) {
            if (data1.gncount - 1 === 1) {
                playsorplay = "play"
            }
            if (data1.gncount - 1 === 0) {
                playsorplay = "plays"
            }
            if (data1.gncount - 1 !== 1) {
                playsorplay = "plays"
            }
            number1 = "**1:** __" + data1.id + " with **" + (data1.gncount - 1) + "** " + playsorplay + "!__\n";
        }

        const alltheguilds = sorted.splice(0, 100)
        let allwinners;
        for (const data2 of alltheguilds) {
            if (data2.gncount - 1 === 1) {
                playsorplay = "play"
            }
            if (data2.gncount - 1 === 0) {
                playsorplay = "plays"
            }
            allwinners += `**${i}:** "${data2.id}" with **${data2.gncount-1}** ${playsorplay}!\n`;
            i++;
            allwinners = allwinners.replace(/undefined/, '');
        }

        const hastebin = require("hastebin-gen");

        hastebin("## All Guild 8ball Plays\n\n" + number1 + otherwinners + allwinners, {
            url: "https://paste.mod.gg",
            extension: "md"
        }).then(haste => {

            const embed = new Discord.RichEmbed()
                .setTitle("Top 10 Guild 8ball Plays")
                .setDescription(number1 + "\n" + otherwinners + "\n**Your Guild's Position**\n**" + (rank + 1) + `:** "${message.guild.name}" with **` + actualcount + `** ${playsorplay1}!`)
                .setColor("#9a00ff")
                .setTimestamp()
                .setFooter("Magic8 by Fyrlex#2740 ", bot.user.displayAvatarURL)

            message.channel.send(embed);
            if (message.author.id === "292821168833036288") {
                bot.users.get("292821168833036288").send(`**All 8ball Plays: __<${haste}>__****`)
            }
        });
    }

    if (args[0] === "odds") {
      
      // return message.channel.send(maintenance)

        let guildoddscount = EnmapGONCDb.get(`${message.guild.id}`, "gonc")
        let actualcount = guildoddscount - 1;

        if (actualcount === 1) {
            playsorplay1 = "play"
        }
        if (actualcount === 0) {
            playsorplay1 = "plays"
        }
        if (actualcount !== 0) {
            playsorplay1 = "plays"
        }

        const filtered = EnmapGONCDb.array()

        const sorted = filtered.sort((a, b) => b.gonc - a.gonc);

        let rank = 0;
        for (let i = 0; i < sorted.length; i++) {
            let guildn = bot.guilds.get(sorted[i].id)
            if (sorted[i].id === message.guild.name) {
                rank = i;
            }
        }

        const top10 = sorted.splice(1, 9);

        const firstplace = sorted.splice(0, 1);

        let otherwinners;
        let i = 2;
        for (const data of top10) {
            if (data.gonc - 1 === 1) {
                playsorplay = "play"
            }
            if (data.gonc - 1 === 0) {
                playsorplay = "plays"
            }
            if (data.gonc - 1 !== 0) {
                playsorplay = "plays"
            }
            otherwinners += `**${i}:** "${data.id}" with **${data.gonc-1}** ${playsorplay}!\n`;
            i++;
            otherwinners = otherwinners.replace(/undefined/, '');
        }

        let number1;
        for (const data1 of firstplace) {
            if (data1.gonc - 1 === 1) {
                playsorplay = "play"
            }
            if (data1.gonc - 1 === 0) {
                playsorplay = "plays"
            }
            if (data1.gonc - 1 !== 1) {
                playsorplay = "plays"
            }
            number1 = "**1:** __" + data1.id + " with **" + (data1.gonc - 1) + "** " + playsorplay + "!__\n";
        }

        const alltheguilds = sorted.splice(0, 100)
        let allwinners;
        for (const data2 of alltheguilds) {
            if (data2.gonc - 1 === 1) {
                playsorplay = "play"
            }
            if (data2.gonc - 1 === 0) {
                playsorplay = "plays"
            }
            allwinners += `**${i}:** "${data2.id}" with **${data2.gonc-1}** ${playsorplay}!\n`;
            i++;
            allwinners = allwinners.replace(/undefined/, '');
        }

        const hastebin = require("hastebin-gen");

        hastebin("## All Guild Odds Plays\n\n" + number1 + otherwinners + allwinners, {
            url: "https://paste.mod.gg",
            extension: "md"
        }).then(haste => {

            const embed = new Discord.RichEmbed()
                .setTitle("Top 10 Guild Odds Plays")
                .setDescription(number1 + "\n" + otherwinners + "\n**Your Guild's Position**\n**" + (rank + 1) + `:** "${message.guild.name}" with **` + actualcount + `** ${playsorplay1}!`)
                .setColor("#9a00ff")
                .setTimestamp()
                .setFooter("Magic8 by Fyrlex#2740 ", bot.user.displayAvatarURL)

            message.channel.send(embed);
            if (message.author.id === "292821168833036288") {
                bot.users.get("292821168833036288").send(`**All Odds Plays: __<${haste}>__**`)
            }
        });
    }

    let log = bot.channels.get(botconfig.commandlogs)

    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;

    if (message.author.id !== "292821168833036288") {

        let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()

        log.send("`" + `${timechange} [COMMAND]: 'top ${args[0]}', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")
    }
}

module.exports.help = {
    name: "top"
}