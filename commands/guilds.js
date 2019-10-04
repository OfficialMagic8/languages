const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {

    message.delete();
  
    if (message.author.id !== "292821168833036288") return;

    if (!EnmapGuildCommandsDb.has(`${message.guild.id}`)) {
        const guildCommands = EnmapGuildCommandsDb.ensure(message.guild.id, {
            gcount: 0,
            id: message.guild.id
        });
        EnmapGuildCommandsDb.inc(message.guild.id, "gcount");
    }

    const filtered = EnmapGuildCommandsDb.array()

    const sorted = filtered.sort((a, b) => b.gcount - a.gcount);

    const top50 = sorted.splice(0, 100);

    let guilds;
    let i = 1;
  
    for (const data of top50) {
        guilds += `**${i}:** ${bot.guilds.get(`${data.id}`).name} - ${data.id} - ${data.gcount} plays\n`;
        i++;
        guilds = guilds.replace(/undefined/, '');
    }
  
    const hastebin = require("hastebin-gen");
    
    hastebin("## All Guilds and ID's\n\n" + guilds, {
        extension: "md"
    }).then(haste => {

    const embed = new Discord.RichEmbed()

        .setTitle("Guild Name/ID List")
        .setDescription(`Click here for the list of guilds ${haste}`)
        .setColor("#9a00ff")
        .setTimestamp()
        .setFooter("Magic8 by Fyrlex#2740 ", bot.user.displayAvatarURL)

    message.channel.send(embed).then(msg => {
        msg.delete(30000)
    })
    });
}

module.exports.help = {
    name: "guilds"
}