const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
// const disk = require('diskusage');
// const os = require('os');
// let path = os.platform() === 'win32' ? 'c:' : '/';

module.exports.run = async (bot, message, args) => {

    message.delete();

    let maintenance = botconfig.maintenance;

    // if (message.author.id !== "292821168833036288") return message.reply(maintenance);

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

    if (!EnmapEChannelIDDb.has(`${message.guild.id}`)) {
        const ochannelID = EnmapEChannelIDDb.ensure(message.guild.id, {
            echannelid: 0,
            id: message.guild.id
        });
        EnmapEChannelIDDb.inc(message.guild.id, "echannelid");
    }
  
    if (!EnmapOChannelIDDb.has(`${message.guild.id}`)) {
        const ochannelID = EnmapOChannelIDDb.ensure(message.guild.id, {
            ochannelid: 0,
            id: message.guild.id
        });
        EnmapOChannelIDDb.inc(message.guild.id, "ochannelid");
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
            id: message.guild.id
        });
        EnmapGONCDb.inc(message.guild.id, "gonc");
    }

    let total8ballCommands = EnmapGuildCommandsDb.get(`${message.guild.id}`, "gcount")
    let totalOddsCommands = EnmapGOCDb.get(`${message.guild.id}`, "goc")
    
    let theEchannelid = EnmapEChannelIDDb.get(`${message.guild.id}`, "echannelid")
    let theOchannelid = EnmapOChannelIDDb.get(`${message.guild.id}`, "ochannelid")
    
    let replynumber = EnmapRepliesDb.get(`${message.guild.id}`, "replynumber")

    let replytype = replynumber
    if (replynumber === 1) {
        replytype = "all"
    }
    if (replynumber === 2) {
        replytype = "clean"
    }
    if (replynumber === 3) {
        replytype = "explicit"
    }

    let echannelname;
    let eabrackethashtag = "<#"
    let eabracket = ">"
    let enochannel = EnmapEChannelIDDb.get(`${message.guild.id}`, "echannelid")
    if (enochannel === 1) {
        echannelname = "none"
        eabrackethashtag = ""
        eabracket = ""
    } else {
        echannelname = theEchannelid
    }
  
    let ochannelname;
    let oabrackethashtag = "<#"
    let oabracket = ">"
    let onochannel = EnmapOChannelIDDb.get(`${message.guild.id}`, "ochannelid")
    if (onochannel === 1) {
        ochannelname = "none"
        oabrackethashtag = ""
        oabracket = ""
    } else {
        ochannelname = theOchannelid
    }

    let no8ball = EnmapGuildCommandsDb.get(`${message.guild.id}`, "gcount"); {
        total8ballCommands = no8ball - 1
    }
    let noOdds = EnmapGOCDb.get(`${message.guild.id}`, "goc"); {
        totalOddsCommands = noOdds - 1
    }


    let vchannels = message.guild.channels.filter(chnl => chnl.type === "voice").size;
    let tchannels = message.guild.channels.filter(chnl => chnl.type === "text").size

    let sbots = message.guild.members.filter(member => member.user.bot).size;
    let susers = message.guild.members.filter(member => !member.user.bot).size;
    let users = bot.users.size;
    let channels = bot.channels.size;
    let online = message.guild.members.filter(member => member.presence.status !== 'offline').size

    let botname = bot.user.username;
    let botinfoembed = new Discord.RichEmbed()

        .setColor("#9a00ff")
        .setAuthor(`${botname} - Information`, bot.user.displayAvatarURL)
        .setDescription("In **" + message.guild.name + "**, 8ball has been played **" + total8ballCommands + "** times and Odds has been played **" + totalOddsCommands + "** times!\n\n**__Bot Stats__**\n**Total Guilds:** " + bot.guilds.size + "\n**Total Users:** " + users + "\n**Total Channels:** " + channels + "\n\n**__Server Stats__**\n**Bots/Users/Online:** " + sbots + "/" + susers + "/" + online + "\n**Text/Voice Channels:** " + tchannels + "/" + vchannels + "\n\n__**Channels**__\n" + `**8ball:** ${eabrackethashtag}` + echannelname + `${eabracket}\n**Odds:** ${oabrackethashtag}` + ochannelname + `${oabracket}`)
        .addField("Reply Type", replytype)
        .addField("Ping", `${Date.now() - message.createdTimestamp}ms`)
        .addField("Source Code", "__https://github.com/Fyrlex/Magic8__", true)
        .addField("Support Server", "__https://discord.gg/MCRbYdc__", true)
        .setFooter("Developed by Fyrlex#2740 on Tuesday, 8/28/2018 by Fyrlex#2740", bot.user.displayAvatarURL)
        .setTimestamp()

    message.channel.send(botinfoembed);

    let fbots = message.guild.members.filter(member => member.user.bot).size;
    let fusers = message.guild.members.filter(member => !member.user.bot).size;

    let log = bot.channels.get(botconfig.commandlogs)

    let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: 'info', Author: ${message.author.username}, Server: ${message.guild.name} (${fusers}/${fbots})` + "`")
}

module.exports.help = {
    name: "info"
}