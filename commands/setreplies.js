const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let needperm = "I need the permission `Manage Messages/Embed Links` to send my messages and delete your message!"

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply(needperm).then(msg => {
        msg.delete(10000)
    })

    let nopermembed = new Discord.RichEmbed()

        .setColor("#ff0000")
        .setDescription("**ERROR:** You must have `ADMINISTRATOR` to do this.")

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(nopermembed)

    let incorrectembed = new Discord.RichEmbed()

        .setColor("#ff0000")
        .setDescription("**Please type one of the following: `all`, `clean` or `explicit`!**")
        .setFooter("Magic8")
        .setTimestamp()

    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;
    let log = bot.channels.get(botconfig.commandlogs)
    let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()
    let logmsg = "`" + `${timechange} [COMMAND]: 'setreplies', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`"

    let newreplies = args[0];

    let setrepliesembed = new Discord.RichEmbed()

        .setAuthor("Replies Set")
        .setColor("#00ff00")
        .setDescription("You will now receive: `" + newreplies + "` responses!")
        .setFooter("Magic8")
        .setTimestamp()

    if (!newreplies) return message.channel.send(incorrectembed)
    if (!["all", "explicit", "clean"].includes(newreplies)) return message.channel.send(incorrectembed)
    if (["all", "explicit", "clean"].includes(newreplies)) {

        if (newreplies === "all") EnmapRepliesDb.set(`${message.guild.id}`, 1, "replynumber")
        if (newreplies === "clean") EnmapRepliesDb.set(`${message.guild.id}`, 2, "replynumber")
        if (newreplies === "explicit") EnmapRepliesDb.set(`${message.guild.id}`, 3, "replynumber")


        message.channel.send(setrepliesembed).then(msg => {
            msg.delete(30000)
        })

        log.send(logmsg)
    }
}

module.exports.help = {
    name: "setreplies"
}