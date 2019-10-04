const Discord = require("discord.js");
var child_process = require('child_process');

module.exports.run = async (bot, message, args) => {

    message.delete();

    if (!message.member.id === "292821168833036288") return;

    let reason = args.join(" ");
    if (!reason) {
        reason = "none"
    }

    console.log("Restarted by: " + message.author.username)

    let themessage = "You restarted the bot! Please make sure you wait at least 10 seconds between restarting as it takes a while to start up again."

    let embed = new Discord.RichEmbed()

        .setDescription(themessage)
        .setColor("#ff0000")

    message.channel.send(embed).then(msg => {
        msg.delete(15000)
    })

    // this right here is the restart function

    setTimeout(() => {
        child_process.exec('refresh', function(error, stdout, stderr) {
            console.log(stdout);
            bot.user.setActivity("restarting...")
        });
    }, 1500)
}

module.exports.help = {
    name: "restart"
}