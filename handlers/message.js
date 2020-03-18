const { bot } = require("../index.js");
const botconfig = require("../botconfig.json");

bot.on("message", message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    
    if (message.content.startsWith("m*8ball")) {
      let theEchannelid = EnmapEChannelIDDb.get(`${message.guild.id}`, "echannelid")
          if (theEchannelid !== 1) {
            if (message.channel.id !== theEchannelid) {
                let embed = new Discord.RichEmbed()
                    .setColor("#ff0000")
                    .setDescription("**ERROR:** There is a set channel for `8ball`, please go to <#" + theEchannelid + "> to use the command!")
                    .setTimestamp()
                    .setFooter("Join support @ discord.gg/MCRbYdc - Magic8")

                message.channel.send(embed).then(msg => msg.delete(30000))
                message.delete();
                return;
            }
        }
    }

    let prefix = botconfig.prefix;

    if (!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase()
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);
});
