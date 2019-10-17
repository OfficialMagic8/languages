const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let maintenance = botconfig.maintenance;

    // if (message.author.id !== "292821168833036288") return message.reply(maintenance);

    let needperm = "I need the permission `Manage Messages/Embed Links` to send my messages and delete your message!"

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply(needperm).then(msg => {
        msg.delete(10000)
    })

    let prefix = botconfig.prefix
    let array = ["`" + prefix + "8ball` - The Magic 8 Ball",
        "`" + prefix + "help` - Displays this help menu",
        "`" + prefix + "info` - Bot/Server Information!",
        "`" + prefix + "leave` - Kicks the bot from the server",
        "`" + prefix + "list` - List responses, feel free to request one to be added",
        "`" + prefix + "odds` - New game! Type the command for help!",
        "`" + prefix + "setchannel` - (Optional) Run this in a specific channel for Magic8 to operate in, type `m\*setchannel 0` to enable Magic8 for all channels",
        "`" + prefix + "setreplies` - *New!* Set the type of replies for your server! Options: all, clean and just explicit.",
        "`" + prefix + "top` - Top 10 8ball Guilds Plays"
    ]

    let description = array.createText();
    let sicon = bot.user.displayAvatarURL;
    let hEmbed = new Discord.RichEmbed()
        .setTitle("Help Menu")
        .setThumbnail(sicon)
        .setColor("#9a00ff")
        .setDescription(description + "\n\nNeed more help? Click [here](https://discord.gg/MCRbYdc) for the Support Server!")
        .setFooter("Join support @ discord.gg/MCRbYdc - Magic8", bot.user.displayAvatarURL)
        .setTimestamp()

    message.channel.send(hEmbed);

    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;

    let log = bot.channels.get(botconfig.commandlogs)

    let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: 'help', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")
}

Array.prototype.createText = function () {
    return this.join("\n")
}

module.exports.help = {
    name: "help"
}