const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let maintenance = botconfig.maintenance;

    // if (message.author.id !== "292821168833036288") return message.reply(maintenance);

    let noperm = new Discord.RichEmbed()

        .setDescription("**ERROR:** You must have `ADMINISTRATOR` to do this.")
        .setColor("#ff0000")

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(noperm).then(msg => {
        msg.delete(10000)
    })


    let leaveEmbed = new Discord.RichEmbed()

        .setDescription(message.author + ", so sorry to leave :(\nDid I do something wrong? What made you kick me out? It would be appreciated if you contacted my creator `@Fyrlex#2740` for ideas, questions or comments.\n\nIf you ever want me to come back, click [here](https://discordapp.com/oauth2/authorize?client_id=484148705507934208&scope=bot&permissions=93184).")
        .setColor("#9a00ff")

    message.channel.send(leaveEmbed).then(msg => {
        msg.delete(30000)
    })


    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;

    let log = bot.channels.get(botconfig.commandlogs)

    let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: 'leave', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")

    setTimeout(function () {
        message.guild.leave(), 2000
    });
}

module.exports.help = {
    name: "leave"
}