const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let maintenance = botconfig.maintenance;

    // if (message.author.id !== "292821168833036288") return message.reply(maintenance);

    let needperm = "I need the permission `Manage Messages/Embed Links` to send my messages and delete your message!";

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply(needperm).then(msg => {
        msg.delete(10000)
    });

    let usage = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setDescription("**ERROR:** Incorrect usage!\n\nUsage: `m*setchannel <8ball/odds> [0]`\n\nThe `8ball/odds` is required, the `0` is optional (and deletes the set channel).")
        .setTimestamp()
        .setFooter("Magic8")

    let notazero = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setDescription("**ERROR:** Either type `0` to delete the set channel or nothing at all to enable the command for all channels!")
        .setTimestamp()
        .setFooter("Magic8")

    let noperm = new Discord.RichEmbed()
        .setDescription("**ERROR:** You must have `ADMINISTRATOR` to do this.")
        .setColor("#ff0000")
        .setTimestamp()
        .setFooter("Magic8")

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(noperm).then(msg => {
        msg.delete(10000)
    })

    if (!args[0]) return message.channel.send(usage).then(msg => msg.delete(30000));
    if (!["odds", "8ball"].includes(args[0])) return message.channel.send(usage).then(msg => msg.delete(30000));

    if (args[0] === "8ball") {
        if (args[1]) {
            if (args[1] !== "0") return message.channel.send(notazero).then(msg => msg.delete(30000));
        }
        if (args[1] === "0") {

            let ifalreadyzero = EnmapEChannelIDDb.get(`${message.guild.id}`, "echannelid")
            if (ifalreadyzero === 1) {

                let alreadyzeroembed = new Discord.RichEmbed()
                    .setColor("#ff0000")
                    .setDescription(`**ERROR:** 8ball is already enabled for all channels!`)
                    .setTimestamp()
                    .setFooter("Magic8")

                message.channel.send(alreadyzeroembed).then(msg => msg.delete(10000))
                return;
            } else {

                const eChannel = EnmapEChannelIDDb.set(message.guild.id, {
                    echannelid: 0,
                    id: message.guild.id
                });
                EnmapEChannelIDDb.inc(message.guild.id, "echannelid");

                let delchannel = new Discord.RichEmbed()
                    .setColor("#ff0000")
                    .setDescription(`**You deleted your set channel for 8ball. 8ball will now work in all channels, otherwise, type \`m*setchannel 8ball\` in a channel to set a new one!**`)
                    .setTimestamp()
                    .setFooter("Join support @ discord.gg/MCRbYdc - Magic8")

                message.channel.send(delchannel)
            }
        } else {

            let sicon = bot.user.displayAvatarURL;
            let setEmbed = new Discord.RichEmbed()

                .setColor("#9a00ff")
                .setDescription("**This channel, `#" + message.channel.name + "`, has now been set and __8ball__ will only work here!**")
                .setTimestamp()
                .setFooter("Magic8")

            message.channel.send(setEmbed).then(msg => {
                msg.delete(60000)
            });
            EnmapEChannelIDDb.set(`${message.guild.id}`, message.channel.id, "echannelid")
        }
    }

    if (args[0] === "odds") {
        if (args[1]) {
            if (args[1] !== "0") return message.channel.send(notazero).then(msg => msg.delete(30000));
        }
        if (args[1] === "0") {

            let ifalreadyzero = EnmapOChannelIDDb.get(`${message.guild.id}`, "ochannelid")
            if (ifalreadyzero === 1) {

                let alreadyzeroembed = new Discord.RichEmbed()
                    .setColor("#ff0000")
                    .setDescription(`**ERROR:** Odds is already enabled for all channels!`)
                    .setTimestamp()
                    .setFooter("Magic8", bot.user.displayAvatarURL)

                message.channel.send(alreadyzeroembed).then(msg => msg.delete(10000))
                return;
            } else {

                const oChannel = EnmapOChannelIDDb.set(message.guild.id, {
                    ochannelid: 0,
                    id: message.guild.id
                });
                EnmapOChannelIDDb.inc(message.guild.id, "ochannelid");

                let delchannel = new Discord.RichEmbed()
                    .setColor("#ff0000")
                    .setDescription(`**You deleted your set channel for Odds. 8ball will now work in all channels, otherwise, type \`m*setchannel 8ball\` in a channel to set a new one!**`)
                    .setTimestamp()
                    .setFooter("Join support @ discord.gg/MCRbYdc - Magic8", bot.user.displayAvatarURL)

                message.channel.send(delchannel)
            }
        } else {

            let sicon = bot.user.displayAvatarURL;
            let setEmbed = new Discord.RichEmbed()

                .setColor("#9a00ff")
                .setDescription("**This channel, `#" + message.channel.name + "`, has now been set and __Odds__ will only work here!**")
                .setTimestamp()
                .setFooter("Join support @ discord.gg/MCRbYdc - Magic8", bot.user.displayAvatarURL)

            message.channel.send(setEmbed).then(msg => {
                msg.delete(60000)
            });
            EnmapOChannelIDDb.set(`${message.guild.id}`, message.channel.id, "ochannelid")
        }
    }

    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;

    let log = bot.channels.get(botconfig.commandlogs)

    let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: 'setchannel ${args[0]}', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")

}


module.exports.help = {
    name: "setchannel"
}