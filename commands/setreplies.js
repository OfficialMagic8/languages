const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

  if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {
    message.delete()
  }

  let nopermembed = new Discord.RichEmbed()
    .setColor("#ff0000")
    .setDescription("**ERROR:** You must have `ADMINISTRATOR` to do this.")

  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(nopermembed)

  let incorrectembed = new Discord.RichEmbed()
    .setColor("#ff0000")
    .setDescription("**Please type one of the following: `all`, `clean` or `explicit`!**")
    .setFooter("Magic8", bot.user.displayAvatarURL)
    .setTimestamp()

  let newreplies = args[0];

  let setrepliesembed = new Discord.RichEmbed()
    .setAuthor("Replies Set")
    .setColor("#00ff00")
    .setDescription("You will now receive: `" + newreplies + "` responses!")
    .setFooter("Join support @ discord.gg/MCRbYdc - Magic8", bot.user.displayAvatarURL)
    .setTimestamp()

  if (!newreplies) {
    message.channel.send(incorrectembed)
    return;
  } else if (!["all", "explicit", "clean"].includes(newreplies)) {
    message.channel.send(incorrectembed)
    return;
  } else if (["all", "explicit", "clean"].includes(newreplies)) {

    if (newreplies === "all") {
      EnmapRepliesDb.set(`${message.guild.id}`, 1, "replynumber")
    } else if (newreplies === "clean") {
      EnmapRepliesDb.set(`${message.guild.id}`, 2, "replynumber")
    } else if (newreplies === "explicit") {
      EnmapRepliesDb.set(`${message.guild.id}`, 3, "replynumber")
    }

    message.channel.send(setrepliesembed)

    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;
    let log = bot.channels.get(botconfig.commandlogs)
    let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()
    log.send("`" + `${timechange} [COMMAND]: 'setreplies ${args[0]}', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")
  }
}

module.exports.help = {
  name: "setreplies"
}