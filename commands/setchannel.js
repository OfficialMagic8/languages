const Discord = require("discord.js");
const config = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let needperm = "I need the permission `Manage Messages/Embed Links` to send my messages and delete your message!";

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply(needperm).then(msg => {
        msg.delete(10000)
    });

    let noperm = new Discord.RichEmbed()

        .setDescription("**ERROR:** You must have `ADMINISTRATOR` to do this.")
        .setColor("#ff0000")

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(noperm).then(msg => {
        msg.delete(10000)
    })

    if (args[0] === "0") {

        let ifalreadyzero = EnmapChannelIDDb.get(`${message.guild.id}`, "channelid")
        if (ifalreadyzero === 1) {
            let alreadyzeroembed = new Discord.RichEmbed()

                .setColor("#ff0000")
                .setDescription("**ERROR:** Magic8 is already enabled for all channels!")
                .setTimestamp()
                .setFooter("Magic8")

            message.channel.send(alreadyzeroembed).then(msg => msg.delete(10000))
            return;
        } else {

            const guildChannelID = EnmapChannelIDDb.set(message.guild.id, {
                channelid: 0,
                id: message.guild.id
            });
            EnmapChannelIDDb.inc(message.guild.id, "channelid");

            let delchannel = new Discord.RichEmbed()

                .setColor("#ff0000")
                .setDescription("**You deleted your set channel for Magic8. Magic8 will now work in all channels, otherwise, type `\m*setchannel` in a channel to set a new one!**")
                .setTimestamp()
                .setFooter("Magic8")

            message.channel.send(delchannel)
        }
    } else {

        let sicon = bot.user.displayAvatarURL;
        let setEmbed = new Discord.RichEmbed()

            .setColor("#9a00ff")
            .setDescription("**This channel, `#" + message.channel.name + "`, has now been set and Magic8 will only work here!**")
            .setTimestamp()
            .setFooter("Magic8")

        message.channel.send(setEmbed).then(msg => {
            msg.delete(60000)
        })

        EnmapChannelIDDb.set(`${message.guild.id}`, message.channel.id, "channelid")

        let bots = message.guild.members.filter(member => member.user.bot).size;
        let users = message.guild.members.filter(member => !member.user.bot).size;

        let fyrlex = bot.users.get("292821168833036288")

    let timechange = new Date(new Date().getTime() - (4*3600000)).toLocaleString()

    fyrlex.send("`" + `${timechange} [COMMAND]: 'setchannel', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")
    }
}


module.exports.help = {
    name: "setchannel"
}