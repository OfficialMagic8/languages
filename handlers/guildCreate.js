const { bot } = require("../index.js");
const botconfig = require("../botconfig.json");
const fs = require("fs")

const botStats = {
    totalGuildsID: '652539034404519936',
    totalUsersID: '652538780376367104',
};

bot.on("guildCreate", guild => {

    bot.user.setActivity(`m*help | ${bot.guilds.size} servers`);
    bot.channels.get(botStats.totalGuildsID).setName(`Total Guilds : ${bot.guilds.size}`);

    let stats = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));

    stats["guilds"].total++;
    stats["guilds"].daily++;
    stats["guilds"].monthly++;
    stats["guilds"].weekly++;

    fs.writeFile("./stats.json", JSON.stringify(stats, null, 2), (err) => {
        if (err) console.error(err);
    });

    const echannel = EnmapEChannelIDDb.set(guild.id, {
        echannelid: 0,
        id: guild.id
    });
    EnmapEChannelIDDb.inc(guild.id, "echannelid");

    const guildReplies = EnmapRepliesDb.set(guild.id, {
        replynumber: 1,
        id: guild.id
    });
    EnmapRepliesDb.inc(guild.id, "replynumber");

    let bots = guild.members.filter(member => member.user.bot).size;
    let users = guild.members.filter(member => !member.user.bot).size;
    let channels = guild.channels.size;

    let timechange = new Date(new Date().getTime() - (5 * 3600000)).toLocaleString()

    let cdate = guild.createdAt.toString().split(' ');

    let changeMessage = ("`" + `${timechange} [GUILD.JOIN]: Guild: '${guild.name}', ID: '${guild.id}', Created: ${cdate[1]}, ${cdate[2]} ${cdate[3]} | (${users}/${bots}/${channels})` + "`")
    let log = bot.channels.get(botconfig.guildlogs)

    log.send(changeMessage)
});