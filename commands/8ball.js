const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const fs = require("fs")
module.exports.run = async (bot, message, args) => {

  message.delete();

  let log = bot.channels.get(botconfig.commandlogs)
  let bots = message.guild.members.filter(member => member.user.bot).size;
  let users = message.guild.members.filter(member => !member.user.bot).size;
  let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()

  let stats = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));

  let m = botconfig.maintenance;

  //  if (message.author.id !== botconfig.ownerid) return message.reply(m);

  let ev = botconfig.eversion;

  let needperm = "I need the permission `Manage Messages/Embed Links` to send my messages and delete your message!"

  if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.reply(needperm).then(msg => {
    msg.delete(10000)
  })

  if (!args[0]) {

    let nothing = new Discord.RichEmbed()

      .setColor("#ff0000")
      .setDescription("**ERROR:** Please ask something!")

    message.channel.send(nothing).then(m => m.delete(10000))

    return;
  }

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

    .setColor("#9a00ff")
    .setAuthor(`${botname} - 8Ball ${ev}`, bot.user.displayAvatarURL)
    .setDescription(`Asked by ${message.author.tag}`)
    .addField("Question", question)
    .addField("Answer", answer)
    .setTimestamp()
    .setFooter("Join support @ discord.gg/MCRbYdc - Magic8", bot.user.displayAvatarURL)

  message.channel.send(ballEmbed)
  log.send("`" + `${timechange} [COMMAND]: '8ball', Question: "${message.content}", Answer: "${answer}" Author: ${message.author.tag}, Server: ${message.guild.name} (${users}/${bots})` + "`")

  let totaluses = stats["8ball"].total;
  bot.channels.get("652555918285996032").setName(`Total 8ball Plays : ${totaluses + 1}`);

  stats["8ball"].total++;
  stats["8ball"].monthly++;
  stats["8ball"].weekly++;
  stats["8ball"].daily++;

  fs.writeFile("./stats.json", JSON.stringify(stats, null, 2), (err) => {
    if (err) console.error(err);
  });
}

module.exports.help = {
  name: "8ball"
}