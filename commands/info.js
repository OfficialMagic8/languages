const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const fs = require("fs")
let stats = JSON.parse(fs.readFileSync("./stats.json", "utf8"));

module.exports.run = async (bot, message, args) => {

  if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {
    message.delete()
  }

  if (!EnmapEChannelIDDb.has(`${message.guild.id}`)) {
    const ochannelID = EnmapEChannelIDDb.ensure(message.guild.id, {
      echannelid: 0,
      id: message.guild.id
    });
    EnmapEChannelIDDb.inc(message.guild.id, "echannelid");
  }

  let theEchannelid = EnmapEChannelIDDb.get(`${message.guild.id}`, "echannelid")
  let replynumber = EnmapRepliesDb.get(`${message.guild.id}`, "replynumber")

  let replytype = replynumber
  if (replynumber === 1) {
    replytype = "all"
  } else if (replynumber === 2) {
    replytype = "clean"
  } else if (replynumber === 3) {
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

  let vchannels = message.guild.channels.filter(chnl => chnl.type === "voice").size;
  let tchannels = message.guild.channels.filter(chnl => chnl.type === "text").size

  let sbots = message.guild.members.filter(member => member.user.bot).size;
  let susers = message.guild.members.filter(member => !member.user.bot).size;
  let users = bot.users.size;
  let channels = bot.channels.size;
  let online = message.guild.members.filter(member => member.presence.status !== 'offline').size
  let totaluses = stats["8ball"].total;

  let botname = bot.user.username;
  let botinfoembed = new Discord.RichEmbed()

    .setColor("#9a00ff")
    .setAuthor(`${botname} - Information`, bot.user.displayAvatarURL)
    .setDescription(`\n\n**__Bot Stats__**\n**Total Guilds:** ${bot.guilds.size}\n**Total Users:** ${users}\n**Total Channels:** ${channels}\n\n**8ball Plays:** ${totaluses}**\n\n__Server Stats__**\n**Users/Bots/Online:** ${susers}/${sbots}/${online}\n**Text/Voice Channels:** ${tchannels}/${vchannels}\n\n**8ball Channel:** ${eabrackethashtag}${echannelname}${eabracket}\n**Reply Type:** ${replytype}`)
    .addField("Response Time", `${Date.now() - message.createdTimestamp}ms`)
    .addField("Links", "[Donate](https://www.paypal.me/magic8bot), [Source Code](https://github.com/Fyrlex/Magic8), [Support Server](https://discord.gg/MCRbYdc), [Vote](https://top.gg/bot/484148705507934208/vote), [Website](https://magic8-bot.glitch.me/)")
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