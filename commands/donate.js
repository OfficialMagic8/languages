const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const prefix = botconfig.prefix;

module.exports.run = async (bot, message, args) => {

    message.delete();

    let donateEmbed = new Discord.RichEmbed()

        .setAuthor("Magic8 Donation Page", bot.user.displayAvatarURL)
        .setColor("#9a00ff")
        .setDescription('Donating to developers are motives for them to keep their projects going and let them know people care about their work.\n\nMagic8 will for sure be around for a long time, but all the work put in to Magic8 depends on what you users want it to be. Donating also allows for you to be a partner with the **[Magic8 Support Server](https://discord.gg/MCRbYdc "Magic8 Support Server")** (more details in the server) and gives you an exclusive role.\n\n\n**Donation Link:** __https://www.paypal.me/magic8bot__\n\n\n-Thank you for your support!')
        .setTimestamp()

    message.channel.send(donateEmbed)
}

module.exports.help = {
    name: "donate"
}