const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let array = [
        "`✅` Set channel for Odds - `10/15/2019`",
        "`✅` Top command fully operational for Odds and 8ball (was just 8ball top before) - `10/15/2019`",
        "`✅` Added new responses if you don't use a question mark! Open for suggestions - `11/7/2019`",
        " ",
        "`➖` Custom Prefix",
        " ",
        "`⭕` The m*setchannel command only makes the selected command work in one channel (odds or 8ball) (was for all commands before) - `10/15/2019`",
        " ",
        "`❌` Removed m*top command - `11/6/2019`",
        "`❌` Removed 8ball count per server, caused database issues with storage (that means you guys are really using it!) - `11/6/2019`"
    ]
    let changelogtext = array.createText()
    let changelogembed = new Discord.RichEmbed()

        .setAuthor("Magic8 Changelog", bot.user.displayAvatarURL)
        .setColor("#9a00ff")
        .setDescription(array)
        .setTimestamp()
        .setFooter("Join support @ discord.gg/MCRbYdc - Magic8", bot.user.displayAvatarURL)

    message.channel.send(changelogembed)
}

module.exports.help = {
    name: "changelog"
}
