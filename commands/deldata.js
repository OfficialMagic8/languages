const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    if (!message.member.id === "292821168833036288") return;

    let theguildid = args[0];

    if (!bot.guilds.has(theguildid)) return;

    let deldata = new Discord.RichEmbed()

        .setColor("#00ff00")
        .setAuthor("Reset Guild")
        .setDescription("**Guild Name/ID:**\n" + bot.guilds.get(theguildid).name + "/" + theguildid)
        .setTimestamp()

    message.channel.send(deldata)

    EnmapGuildNameCommandsDb.delete(theguildid)
    EnmapGuildCommandsDb.delete(theguildid)
    EnmapRepliesDb.delete(theguildid)
}


module.exports.help = {
    name: "deldata"
}