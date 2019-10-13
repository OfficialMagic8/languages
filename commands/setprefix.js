const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    if (message.author.id !== "292821168833036288") return message.reply("This command is being worked on! Please be patient, this may go on and off until the work is done and operating correctly!");

    let needperm = "I need the permission `Manage Messages/Embed Links` to send my messages and delete your message!"

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply(needperm).then(msg => {
        msg.delete(10000)
    });

    let nopermembed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setDescription("**ERROR:** You must have `ADMINISTRATOR` to do this.")

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(nopermembed)

    let newprefix = args[0]
    if (args >= 1) return;



    let sicon = bot.user.displayAvatarURL;
    let setprefixembed = new Discord.RichEmbed()

        .setAuthor("Prefix Set")
        .setThumbnail(sicon)
        .setColor("#00ff00")
        .setDescription("Magic8 will now work only with the prefix: " + newprefix)
        .setFooter("Magic8")
        .setTimestamp()

    message.channel.send(setprefixembed).then(msg => {
        msg.delete(60000)
    })

    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;

    let log = bot.channels.get(botconfig.commandlogs)

    let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: 'setprefix', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")
}

module.exports.help = {
    name: "setprefix"
}