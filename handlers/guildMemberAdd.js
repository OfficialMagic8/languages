const { bot } = require("../index.js");
const botconfig = require("../botconfig.json");

const botStats = {
    totalGuildsID: '652539034404519936',
    totalUsersID: '652538780376367104',
};

bot.on("guildMemberAdd", async member => {

    bot.channels.get(botStats.totalUsersID).setName(`Total Users : ${bot.users.size}`);

    if (member.guild.id !== "610816275580583936") return;
    let welcomelogs = bot.channels.get("627864514444001280")

    let linebreak = "~~                                                                     ~~\n"
    let joinmsg = "<:magic8:662013341060825088> - " + member + " joined `✅`"

    welcomelogs.send(linebreak + joinmsg)
});