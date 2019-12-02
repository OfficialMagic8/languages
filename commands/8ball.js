const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let maintenance = botconfig.maintenance;

    // if (message.author.id !== "292821168833036288") return message.reply(maintenance);

    let ev = botconfig.eversion;

    let needperm = "I need the permission `Manage Messages/Embed Links` to send my messages and delete your message!"

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply(needperm).then(msg => {
        msg.delete(10000)
    })

    if (message.content.endsWith("?")) {

        let replynumber = EnmapRepliesDb.get(`${message.guild.id}`, "replynumber")
        let replies;

        if (replynumber === 1) {
            replies = botconfig.all
        }
        if (replynumber === 2) {
            replies = botconfig.clean
        }
        if (replynumber === 3) {
            replies = botconfig.explicit
        }

        let botname = bot.user.username;
        let result = Math.floor((Math.random() * replies.length));
        let question = args.slice(0).join(" ");
        let answer = replies[result];

        let ballEmbed = new Discord.RichEmbed()

            .setColor("#9a00ff")
            .setAuthor(`${botname} - 8Ball ${ev}`, bot.user.displayAvatarURL)
            .setDescription(`Asked by ${message.author.tag}`)
            .addField("Question", question)
            .addField("Answer", answer)
            .setTimestamp()
            .setFooter("Join support @ discord.gg/MCRbYdc - Magic8", bot.user.displayAvatarURL)

        message.channel.send(ballEmbed)

    } else {

        let replies = botconfig.noquestionmark;
        let result = Math.floor((Math.random() * replies.length))
        let question = args.slice(0).join(" ");
        let answer = replies[result]

        let ballEmbed = new Discord.RichEmbed()

            .setColor("#9a00ff")
            .setAuthor(`${botname} - 8Ball ${ev}`, bot.user.displayAvatarURL)
            .setDescription(`Asked by ${message.author.tag}`)
            .addField("Question", question)
            .addField("Answer", answer)
            .setTimestamp()
            .setFooter("Join support @ discord.gg/MCRbYdc - Magic8", bot.user.displayAvatarURL)

        message.channel.send(ballEmbed)
    }
    
    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;

    let log = bot.channels.get(botconfig.commandlogs)

    let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: '8ball', Question: "${message.content}" Author: ${message.author.tag}, Server: ${message.guild.name} (${users}/${bots})` + "`")
}

module.exports.help = {
    name: "8ball"
}