const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
var child_process = require('child_process');

module.exports.run = async (bot, message, args) => {

    message.delete();

    if (!message.member.id === "292821168833036288") return;

    let reason = args.join(" ");
    if (!reason) {
        reason = "none"
    }

    let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()
    let log = bot.channels.get(botconfig.otherlogs);

    log.send("`" + `${timechange} [RESTART]: Author: ${message.author.tag}` + "`")

    let themessage = "You restarted the bot! Please make sure you wait at least 10 seconds between restarting as it takes a while to start up again."

    let embed = new Discord.RichEmbed()

        .setDescription(themessage)
        .setColor("#ff0000")

    message.channel.send(embed).then(msg => {
        msg.delete(15000)
    })

    // this right here is the restart function

    setTimeout(() => {
        child_process.exec('refresh', function (error, stdout, stderr) {
            console.log(stdout);
            bot.user.setActivity("restarting...")
        });
    }, 1500)
}

module.exports.help = {
    name: "restart"
}