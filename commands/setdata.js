const Discord = require("discord.js");
const config = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    if (!message.member.id === "292821168833036288") return;

    let theguildid = args[0];
  
    let value = args[1];
  
    if (isNaN(value)) return message.reply("Please enter a number.")

    let actualvalue = value+1;
    if (!bot.guilds.has(theguildid)) return;

    let setdata = new Discord.RichEmbed()

        .setColor("#00ff00")
        .setAuthor("Set Guild")
        .setDescription("**Guild Name/ID:**\n" + bot.guilds.get(theguildid).name + "/" + theguildid + "\nNow has **" + value + "** plays!")
        .setTimestamp()

    message.channel.send(setdata).then(msg => msg.delete(10000))
    
    EnmapGuildNameCommandsDb.set(`${theguildid}`, (value), "gncount")
    EnmapGuildCommandsDb.set(`${theguildid}`, (value), "gcount")


}

module.exports.help = {
    name: "setdata"
}