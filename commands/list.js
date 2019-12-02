const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const hastebin = require("hastebin-gen");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let maintenance = botconfig.maintenance;

    // if (message.author.id !== "292821168833036288") return message.reply(maintenance);

    let needperm = "I need the permission `Manage Messages/Embed Links` to send my messages and delete your message!"

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply(needperm).then(msg => {
        msg.delete(10000)
    })

    let allreplies = botconfig.all
    let aformatted = allreplies.join(",\n")
    let cleanreplies = botconfig.clean
    let cformatted = cleanreplies.join(",\n")
    let explicitreplies = botconfig.explicit
    let eformatted = explicitreplies.join(",\n")

    hastebin("## List of Responses\n\n" + aformatted, {
        url: "https://paste.mod.gg",
        extension: "md"
    }).then(ahaste => {

        let sicon = bot.user.displayAvatarURL;
        let listembed = new Discord.RichEmbed()

            .setColor("#9a00ff")
            .setThumbnail(sicon)
            .setTitle("Responses for 8ball")
            .setDescription("The responses are categoriezed by `all`, `clean` and `explicit`. Suggestions for organizing/adding responses are greatly appreciated.\n\nLink: __" + ahaste + "__")
            .setTimestamp()
            .setFooter("Join support @ discord.gg/MCRbYdc - Magic8", bot.user.displayAvatarURL)

        message.author.send(listembed)
    });

    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;

    let log = bot.channels.get(botconfig.commandlogs)

    let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: 'list', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")
}

module.exports.help = {
    name: "list"
}