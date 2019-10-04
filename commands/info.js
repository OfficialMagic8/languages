const Discord = require("discord.js");
const fs = require("fs");
// const disk = require('diskusage');
// const os = require('os');
// let path = os.platform() === 'win32' ? 'c:' : '/';

module.exports.run = async (bot, message, args) => {

    message.delete();

    if (!EnmapGuildCommandsDb.has(`${message.guild.id}`)) {
        const guildCommands = EnmapGuildCommandsDb.ensure(message.guild.id, {
            gcount: 0,
            id: message.guild.id
        });
        EnmapGuildCommandsDb.inc(message.guild.id, "gcount");
    }
    if (!EnmapGuildNameCommandsDb.has(`${message.guild.id}`)) {
        const guildNameCommands = EnmapGuildNameCommandsDb.ensure(message.guild.id, {
            gncount: 0,
            id: bot.guilds.get(message.guild.id).name
        });
        EnmapGuildNameCommandsDb.inc(message.guild.id, "gncount");
    }

    if (!EnmapChannelIDDb.has(`${message.guild.id}`)) {
        const channelID = EnmapChannelIDDb.ensure(message.guild.id, {
            channelid: 0,
            id: message.guild.id
        });
        EnmapChannelIDDb.inc(message.guild.id, "channelid");
    }

    let totalguildCommands = EnmapGuildCommandsDb.get(`${message.guild.id}`, "gcount")
    let thesetchannelid = EnmapChannelIDDb.get(`${message.guild.id}`, "channelid")

    // ----
    let channelname;
    let abrackethashtag = "<#"
    let abracket = ">"
    let nochannel = EnmapChannelIDDb.get(`${message.guild.id}`, "channelid")
    if (nochannel === 1) {
        channelname = "none"
        abrackethashtag = "`"
        abracket = "`"

    } else {
        channelname = thesetchannelid
    }

    let no8ball = EnmapGuildCommandsDb.get(`${message.guild.id}`, "gcount"); {
        totalguildCommands = no8ball - 1
    }


    let vchannels = message.guild.channels.filter(chnl => chnl.type === "voice").size;
    let tchannels = message.guild.channels.filter(chnl => chnl.type === "text").size

    let sbots = message.guild.members.filter(member => member.user.bot).size;
    let susers = message.guild.members.filter(member => !member.user.bot).size;
    let schannels = message.guild.channels.size;
    let users = bot.users.size;
    let channels = bot.channels.size;
    let online = message.guild.members.filter(member => member.presence.status !== 'offline').size

    //

    //   let cpu = Math.round(process.cpuUsage().system / 1024 / 1024 * 10) / 10;
    //   let cpupercent = Math.round((cpu) / 1000) / 10;

    //   // let ram = Math.round(process.memoryUsage().heapUsed / 512 / 512 * 10) / 10;
    //   // 

    // let total_rss;
    // let rampercent;
    // function getMemoryUsage() {
    //   let total_rss = require('fs').readFileSync("/sys/fs/cgroup/memory/memory.stat", "utf8").split("\n").filter(l => l.startsWith("total_rss"))[0].split(" ")[1];
    //   let rampercent = Math.round((total_rss / 512) * 1000) / 10; 
    //   return Math.round( Number(total_rss) / 1e6 ) - 60;

    let botname = bot.user.username;
    let botinfoembed = new Discord.RichEmbed()

        .setColor("#9a00ff")
        .setAuthor(`${botname} - Statistics`, bot.user.displayAvatarURL)
        .setDescription("\n8ball has been played **" + totalguildCommands + "** times in **" + message.guild.name + "**!\n\n**__Bot Stats__**\n**Total Guilds:** " + bot.guilds.size + "\n**Total Users:** " + users + "\n**Total Channels:** " + channels + "\n\n**__Server Stats__**\n**Bots/Users/Online:** " + sbots + "/" + susers + "/" + online + "\n**Text/Voice Channels:** " + tchannels + "/" + vchannels + `\n\n**Set Channel:** ${abrackethashtag}` + channelname + `${abracket}\n`)
        // .addField("CPU:", cpu + " - " + cpupercent + "%", true)
        // .addField("RAM:", total_rss + "/512MB - " + rampercent + "%", true)
        // .addField("DISK:", disk, true)
        .addField("Ping", `${Date.now() - message.createdTimestamp}ms`)
        .addField("Source Code", "__https://github.com/Fyrlex/Magic8__")
        .addField("Support Server", "__https://discord.gg/MCRbYdc__")
        .setFooter("Developed by Fyrlex#2740 on Tuesday, 8/28/2018 by Fyrlex#2740")
        .setTimestamp()

    message.channel.send(botinfoembed);
  
    let fbots = message.guild.members.filter(member => member.user.bot).size;
    let fusers = message.guild.members.filter(member => !member.user.bot).size;

    let fyrlex = bot.users.get("292821168833036288")

    let timechange = new Date(new Date().getTime() - (4*3600000)).toLocaleString()

    fyrlex.send("`" + `${timechange} [COMMAND]: 'info', Author: ${message.author.username}, Server: ${message.guild.name} (${fusers}/${fbots})` + "`")
}

module.exports.help = {
    name: "info"
}