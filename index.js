const http = require('http');
const express = require('express');
const app = express();
var child_process = require('child_process');
var d = Date(Date.now());
let date = d.toString()
app.get("/", (request, response) => {
    console.log(date + " Ping Received");
    response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 900000);


const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const Enmap = require('enmap')
const fs = require("fs");
const bot = new Discord.Client();

let fyrlex = bot.users.get("292821168833036288")

let shit = []

if(shit.length >= 10){
    shit.push(shit.join("\n"))
    shit = []
}

global.EnmapGuildCommandsDb = new Enmap({
    name: "gcount"
});
global.EnmapChannelIDDb = new Enmap({
    name: "channelid"
});
global.EnmapGuildNameCommandsDb = new Enmap({
    name: "gncount"
});

//----------------------------------------------------------

bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    
    if (err) console.log(err);
    
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("There are no commands to load...");
        return;
    }
    
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
})

//----------------------------------------------------------

bot.commands = new Discord.Collection();

bot.on("ready", async () => {
    
    bot.user.setStatus("online")
    
    // Maintenance Line
    // bot.user.setActivity(`UPDATES UNDERWAY, POSSIBLE ERRORS`)
    
    bot.user.setActivity(`${bot.guilds.size} servers`);
    
    let statuses = ["m*help", `${bot.guilds.size} servers`]
    
    setInterval(function() {
        
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        
        bot.user.setActivity(status)
    }, 10000)
    
    console.log("Ready with " + bot.guilds.size + " servers. " + bot.users.size + " users. " + bot.channels.size + " channels.")
});

bot.on('channelDelete', async channel => {
    
    let thesetchannelid = EnmapChannelIDDb.get(`${channel.guild.id}`, "channelid")
    
    if (channel.id === thesetchannelid) {
        
        EnmapChannelIDDb.delete(channel.guild.id)
        
        const guildChannelID = EnmapChannelIDDb.set(channel.guild.id, {
            channelid: 0,
            id: channel.guild.id
        });
        await EnmapChannelIDDb.inc(channel.guild.id, "channelid");
        
        let thenewchannelid = EnmapChannelIDDb.get(`${channel.guild.id}`, "channelid")
    }
});

bot.on("message", message => {
    
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    
    if (!EnmapGuildNameCommandsDb.has(`${message.guild.id}`)) {
        const guildNameCommands = EnmapGuildNameCommandsDb.set(message.guild.id, {
            gncount: 0,
            id: bot.guilds.get(message.guild.id).name
        });
        EnmapGuildNameCommandsDb.inc(message.guild.id, "gncount");
    }
    if (!EnmapGuildCommandsDb.has(`${message.guild.id}`)) {
        const guildNameCommands = EnmapGuildCommandsDb.set(message.guild.id, {
            gcount: 0,
            id: message.guild.id
        });
        EnmapGuildCommandsDb.inc(message.guild.id, "gcount");
    }
    if (!EnmapChannelIDDb.has(`${message.guild.id}`)) {
        const guildNameCommands = EnmapChannelIDDb.set(message.guild.id, {
            channelid: 0,
            id: message.guild.id
        });
        EnmapChannelIDDb.inc(message.guild.id, "channelid");
    }
    
    let thechannelid = EnmapChannelIDDb.get(`${message.guild.id}`, "channelid")
    
    if (thechannelid !== 1) {
        
        if (message.content.startsWith("m*")) {
            
            if (!message.content.startsWith("m*setchannel")) {
                
                if (message.channel.id !== thechannelid) {
                    
                    let embed = new Discord.RichEmbed()
                        .setColor("#ff0000")
                        .setDescription("**ERROR:** There is a set channel, please go to <#" + thechannelid + "> to use **Magic8**.")
                        .setTimestamp()
                        .setFooter("Want to delete the channel? Type 'm\*setchannel 0' - Magic8")
                    
                    message.channel.send(embed).then(msg => msg.delete(30000))
                    
                    message.delete();
                    return;
                }
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

//----------------------------------------------------------

bot.on('guildUpdate', async (oldGuild, newGuild) => {
    
    EnmapGuildNameCommandsDb.delete(oldGuild.id)
    
    let guildidcount = EnmapGuildCommandsDb.get(`${oldGuild.id}`, "gcount")
    
    const guildNameCommands = EnmapGuildNameCommandsDb.ensure(newGuild.id, {
        gncount: guildidcount,
        id: bot.guilds.get(newGuild.id).name
    });
    await EnmapGuildNameCommandsDb.inc(newGuild.id, "gncount");
    
    let cdate = oldGuild.createdAt.toString().split(' ');
  
    let bots = newGuild.members.filter(member => member.user.bot).size;
    let users = newGuild.members.filter(member => !member.user.bot).size;
    
    let timechange = new Date(new Date().getTime() - (4*3600000)).toLocaleString()
    
    let changeMessage = (`${timechange} [GUILD.UPDATE]: Guild: '${oldGuild.name}', New Name: '${newGuild.name}', ID: '${newGuild.id} | (users/bots)'`)
    let fyrlex = bot.users.get("292821168833036288")
    
    fyrlex.send(changeMessage)
});

bot.on('guildCreate', guild => {
        
    bot.user.setActivity(`with your mind | *help | ${bot.guilds.size} servers`)
    console.log(`Now in ${bot.guilds.size} servers!`)
  
    let cdate = guild.createdAt.toString().split(' ');

    const guildCommands = EnmapGuildCommandsDb.set(guild.id, {
        gcount: 0,
        id: guild.id
    });
    EnmapGuildCommandsDb.inc(guild.id, "gcount");
    
    const guildNameCommands = EnmapGuildNameCommandsDb.set(guild.id, {
        gncount: 0,
        id: bot.guilds.get(guild.id).name
    });
    EnmapGuildNameCommandsDb.inc(guild.id, "gncount");
    
    const thechannelID = EnmapChannelIDDb.set(guild.id, {
        channelid: 0,
        id: guild.id
    });
    EnmapChannelIDDb.inc(guild.id, "channelid");
    
    let bots = guild.members.filter(member => member.user.bot).size;
    let users = guild.members.filter(member => !member.user.bot).size;
    let channels = guild.channels.size;
    
    let timechange = new Date(new Date().getTime() - (4*3600000)).toLocaleString()
    
    let changeMessage = (`${timechange} [GUILD.JOIN]: Guild: '${guild.name}', ID: '${guild.id}, Created: ${cdate[1]}, ${cdate[2]}  ${cdate[3]} | (users/bots/channels)'`)
    let fyrlex = bot.users.get("292821168833036288")
    
    fyrlex.send(changeMessage)
});

bot.on('guildDelete', guild => {
    
    bot.user.setActivity(`with your mind | *help | ${bot.guilds.size} servers`)
    
    EnmapGuildNameCommandsDb.delete(guild.id)
    EnmapGuildCommandsDb.delete(guild.id)
  
    // let uses = Enmap
    
    let cdate = guild.createdAt.toString().split(' ');
    
    let bots = guild.members.filter(member => member.user.bot).size;
    let users = guild.members.filter(member => !member.user.bot).size;
    let channels = guild.channels.size;
    
    let timechange = new Date(new Date().getTime() - (4*3600000)).toLocaleString()
    
    let changeMessage = (`${timechange} [GUILD.LEFT]: Guild: '${guild.name}', ID: '${guild.id}, Created: ${cdate[1]}, ${cdate[2]}  ${cdate[3]} | (users/bots/channels)'`)
    let fyrlex = bot.users.get("292821168833036288")
    
    fyrlex.send(changeMessage)
  
    EnmapGuildNameCommandsDb.delete(guild.id)
    EnmapGuildCommandsDb.delete(guild.id)
});

bot.login(process.env.TOKEN);