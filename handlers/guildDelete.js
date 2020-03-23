const { bot } = require("../index.js");
const botconfig = require("../botconfig.json");
const fs = require("fs")

const botStats = {
  totalGuildsID: '652539034404519936',
  totalUsersID: '652538780376367104',
};

bot.on('guildDelete', guild => {

  bot.user.setActivity(`with your mind | *help | ${bot.guilds.size} servers`)
  bot.channels.get(botStats.totalGuildsID).setName(`Total Guilds : ${bot.guilds.size}`);

  let stats = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));
  stats["guilds"].total--
  fs.writeFile("./stats.json", JSON.stringify(stats, null, 2), (err) => {
    if (err) console.error(err);
  });

  EnmapEChannelIDDb.delete(guild.id)

  let bots = guild.members.filter(member => member.user.bot).size;
  let users = guild.members.filter(member => !member.user.bot).size;
  let channels = guild.channels.size;
  let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()
  let cdate = guild.createdAt.toString().split(' ');
  let logmsg = ("`" + `${timechange} [GUILD.LEFT]: Guild: '${guild.name}', ID: '${guild.id}', Created: ${cdate[1]}, ${cdate[2]} ${cdate[3]} | (${users}/${bots}/${channels})` + "`")
  let log = bot.channels.get(botconfig.guildlogs)
  log.send(logmsg)
});