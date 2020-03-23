const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

  if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {
    message.delete()
  }

  let notazero = new Discord.RichEmbed()
    .setColor("#ff0000")
    .setDescription("**ERROR:** Type `0` to delete the set channel. Type nothing to set the 8ball channel in the channel the command is run in.")
    .setTimestamp()
    .setFooter("Magic8")

  let noperm = new Discord.RichEmbed()
    .setDescription("**ERROR:** You must have `ADMINISTRATOR` to do this.")
    .setColor("#ff0000")
    .setTimestamp()
    .setFooter("Magic8")

  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(noperm).then(msg => {
    msg.delete(10000)
  })

  if (args[0]) {
    if (args[0] !== "0") return message.channel.send(notazero).then(msg => msg.delete(30000));
  }

  let ifargs0 = " 0"
  if (!args[0]) {
    ifargs0 = ""
  }

  if (args[0] === "0") {

    let ifalreadyzero = EnmapEChannelIDDb.get(`${message.guild.id}`, "echannelid")
    if (ifalreadyzero === 1) {

      let alreadyzeroembed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setDescription(`**ERROR:** 8ball is already enabled for all channels!`)
        .setTimestamp()
        .setFooter("Magic8")

      message.channel.send(alreadyzeroembed).then(msg => msg.delete(10000))
      return;
    } else {

      const eChannel = EnmapEChannelIDDb.set(message.guild.id, {
        echannelid: 0,
        id: message.guild.id
      });
      EnmapEChannelIDDb.inc(message.guild.id, "echannelid");

      let delchannel = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setDescription(`**You deleted your set channel for 8ball. 8ball will now work in all channels, otherwise, type \`m*setchannel 0\` in a channel to set a new one!**`)
        .setTimestamp()
        .setFooter("Join support @ discord.gg/MCRbYdc - Magic8")

      message.channel.send(delchannel)
    }
  } else {

    let setEmbed = new Discord.RichEmbed()
      .setColor("#9a00ff")
      .setDescription("**This channel, `#" + message.channel.name + "`, has now been set and __8ball__ will only work here!**")
      .setTimestamp()
      .setFooter("Magic8")

    message.channel.send(setEmbed).then(msg => {
      msg.delete(60000)
    });
    EnmapEChannelIDDb.set(`${message.guild.id}`, message.channel.id, "echannelid")
  }

  let bots = message.guild.members.filter(member => member.user.bot).size;
  let users = message.guild.members.filter(member => !member.user.bot).size;

  let log = bot.channels.get(botconfig.commandlogs)

  let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()

  log.send("`" + `${timechange} [COMMAND]: 'setchannel${ifargs0}', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")
}

module.exports.help = {
  name: "setchannel"
}