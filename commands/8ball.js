const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    if (message.author.id !== "292821168833036288") return message.reply("This command is having a new feature added to it! Please be patient, this may go on and off until the work is done and operating correctly!");

    if (!EnmapGuildCommandsDb.has(`${message.guild.id}`)) {
        const guildCommands = EnmapGuildCommandsDb.ensure(message.guild.id, {
            gcount: 0,
            id: message.guild.id
        });
        EnmapGuildCommandsDb.inc(message.guild.id, "gcount");
    }
    if (!EnmapGuildNameCommandsDb.has(`${message.guild.id}`)) {
        const channelName = EnmapGuildNameCommandsDb.ensure(message.guild.id, {
            gncount: 0,
            id: bot.guilds.get(message.guild.id).name
        });
        EnmapGuildNameCommandsDb.inc(message.guild.id, "gncount");
    }

    let needperm = "I need the permission `Manage Messages/Embed Links` to send my messages and delete your message!"

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply(needperm).then(msg => {
        msg.delete(10000)
    })

    let noquestionmark = new Discord.RichEmbed()

        .setDescription("**ERROR:** Please ask a full question with `?` at the end!")
        .setColor("#ff0000")

    if (!message.content.endsWith("?")) return message.channel.send(noquestionmark).then(msg => {
        msg.delete(10000)
    })

    let replynumber = EnmapRepliesDb.get(`${message.guild.id}`, "replynumber")
    let replies;
    if (replynumber === 1) {
        replies = botconfig.all
    }
    if (replynumber === 2) {
        replies = botconfig.clean
    }
    if (replynumber === 3) {
        replies = botconfig.explicit
    }

    let botname = bot.user.username;

    let result = Math.floor((Math.random() * replies.length));
    let question = args.slice(0).join(" ");

    let answer = replies[result];


    let ballEmbed = new Discord.RichEmbed()

        .setThumbnail("https://cdn.shopify.com/s/files/1/0972/7116/products/magic_8_ball_sours_tin.png?v=1503344861")
        .setColor("#9a00ff")
        .setAuthor(`${botname} - 8Ball`, bot.user.displayAvatarURL)
        .setDescription(`Asked by ${message.author.tag}`)
        .addField("Question", question)
        .addField("Answer", answer)
        .setTimestamp()
        .setFooter("Join support @ discord.gg/MCRbYdc - Magic8")

    message.channel.send(ballEmbed)

    let n = EnmapGuildCommandsDb.get(`${message.guild.id}`, "gcount")
    let fix1 = parseInt(n)
    let finalproduct = fix1 + 1;

    EnmapGuildCommandsDb.set(`${message.guild.id}`, finalproduct, "gcount")


    let n2 = EnmapGuildNameCommandsDb.get(`${message.guild.id}`, "gncount")
    let fix2 = parseInt(n2)
    let finalproduct2 = fix2 + 1;

    EnmapGuildNameCommandsDb.set(`${message.guild.id}`, finalproduct2, "gncount")

    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;

    let log = bot.channels.get(botconfig.commandlogs)

    let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: '8ball', Message: "${message.content}" Author: ${message.author.tag}, Server: ${message.guild.name} (${users}/${bots})` + "`")
}

module.exports.help = {
    name: "8ball"
}