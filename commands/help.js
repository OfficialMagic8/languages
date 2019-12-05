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
    let array = [
        "`" + prefix + "8ball` - The Magic 8 Ball",
        "`" + prefix + "changelog` - Updates for magic8",
        "`" + prefix + "help` - Displays this help menu",
        "`" + prefix + "info` - Bot/Server Information!",
        "`" + prefix + "leave` - Kicks the bot from the server",
        "`" + prefix + "list` - List responses for 8ball, feel free to request one to be added",
        "`" + prefix + "setchannel <8ball/odds> [0]` - Run in channel for the game to work in, type 0 to reenable for all channels",
        "`" + prefix + "setreplies <all/clean/explicit` - *New!* Set the type of replies for your server!"
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

    let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: 'help', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")
}

Array.prototype.createText = function () {
    return this.join("\n")
}

module.exports.help = {
    name: "help"
}
