const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let needperm = "I need the permission `Manage Messages/Embed Links` to send my messages and delete your message!"

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply(needperm).then(msg => {
        msg.delete(10000)
    })
    let replies = botconfig.replies
    
    let sicon = bot.user.displayAvatarURL;
    let lEmbed = new Discord.RichEmbed()

        .setAuthor("8ball Responses")
        .setThumbnail(sicon)
        .setColor("#9a00ff")
        .setDescription(replies)
        .setFooter("If you would like a response added/edited, feel free to DM Fyrlex#2740 at anytime for assistance.")

    message.channel.send(lEmbed).then(msg => {
        msg.delete(60000)
    })

    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;

    let log = bot.channels.get(botconfig.commandlogs)

    let timechange = new Date(new Date().getTime() - (4*3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: 'list', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")
}

module.exports.help = {
    name: "list"
}