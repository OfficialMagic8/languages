const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

    message.delete();

    let maintenance = botconfig.maintenance;

    // if (message.author.id !== "292821168833036288") return message.reply(maintenance);
  
    if (!EnmapGOCDb.has(`${message.guild.id}`)) {
        const goc = EnmapGOCDb.ensure(message.guild.id, {
            goc: 0,
            id: message.guild.id
        });
        EnmapGOCDb.inc(message.guild.id, "goc");
    }
  
    if (!EnmapGONCDb.has(`${message.guild.id}`)) {
        const gonc = EnmapGONCDb.ensure(message.guild.id, {
            gonc: 0,
            id: bot.guilds.get(message.guild.id).name
        });
        EnmapGONCDb.inc(message.guild.id, "gonc");
    }
    
    const numbers = new Map([["1⃣", 1], ["2⃣", 2], ["3⃣", 3], ["4⃣", 4], ["5⃣", 5], ["6⃣", 6], ["7⃣", 7], ["8⃣", 8]])
    //Code stolen from AlonsoAliaga :V
    const numbersFormat = new Map([[1, "1️⃣"], [2, "2️⃣"], [3, "3️⃣"], [4, "4️⃣"], [5, "5️⃣"], [6, "6️⃣"], [7, "7️⃣"], [8, "8️⃣"]])
    const keys = Array.from(numbers.keys());
  
    let ov = botconfig.oversion  
  
    let win = botconfig.win;
    let lose = botconfig.lose;
  
    let sortwin = Math.floor((Math.random() * win.length));
    let sortlose = Math.floor((Math.random() * lose.length))
    
    let wintext = win[sortwin];
    let losetext = lose[sortlose];

    let notEargs = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setDescription("**ERROR:** Not enough arguments! Use at least three words!")
        .setTimestamp()
        .setFooter("Magic8 - Odds " + ov, bot.user.displayAvatarURL)
    
    let helpembed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setDescription("**ERROR:** No arguments provded!\n\nDon't know how to play?\n**1.** Dare Magic8 to do something by typing `m*odds <dare>`\n**2.** Guess Magic8's number using the reactions provided!\n**3.** Win or lose and have fun!")
        .setTimestamp()
        .setFooter("Magic8 - Odds " + ov, bot.user.displayAvatarURL)
    
    if (!args[0]) return message.channel.send(helpembed)
    
    if (!args[2]) return message.channel.send(notEargs)

    let dare = args.join(" ")

    let botname = bot.user.username;
    let oddsinfoembed = new Discord.RichEmbed()

        .setColor("#9a00ff")
        .setAuthor(`${botname} - Odds ${ov}`, bot.user.displayAvatarURL)
        .setDescription(`I was given odds by ${message.author.tag}!\nNow pick a number 1-8 or else I win!`)
        .addField("Dare", dare)
        .setTimestamp()
        .setFooter("Join support @ discord.gg/MCRbYdc - Magic8", bot.user.displayAvatarURL)
    
    let numberSelected = keys[Math.floor(Math.random() * keys.length)];

    message.channel.send(oddsinfoembed).then(async msg => {
        try {
          for (let emoji of keys) {
            await msg.react(emoji)
          }

        } catch (error) {
            console.log(error)
        }
      
      const filter = (reaction, user) => numbers.has(reaction.emoji.name) && user.id === message.author.id;
      msg.awaitReactions(filter, {
        max: 1,
        time: 15000,
        errors: ["time"]
      }).then(collected => {
        
        let thenumber = collected.first();
        
        if (thenumber.emoji.name === numberSelected) {
        oddsinfoembed.setColor("#00ff00")
          .addField("Result", `${losetext} \nmy number: \`${numbersFormat.get(numbers.get(numberSelected))}\``)
      } else {
        //Code stolen from AlonsoAliaga :V
        oddsinfoembed.setColor("#ff0000")
          .addField("Result", `${wintext} \nmy number: \`${numbersFormat.get(numbers.get(numberSelected))}\``)
      }
        msg.clearReactions().catch(e => {});
        //Code stolen from AlonsoAliaga :V
        msg.edit(oddsinfoembed).catch(e => {})
      }).catch(e => {
      
        //Code stolen from AlonsoAliaga :V
        
        let editEmbed = new Discord.RichEmbed()
          .setColor("#ff0000")
          .setDescription(`**ERROR:** ${message.author}, you fool! choose a number next time!`)
      msg.clearReactions().catch(e => {});
      //Code stolen from AlonsoAliaga :V
      msg.edit(editEmbed).then(msg => {msg.delete(10000)}).catch(e => {})
      });
    });

    let n = EnmapGOCDb.get(`${message.guild.id}`, "goc")
    let fix1 = parseInt(n)
    let finalproduct = fix1 + 1;

    EnmapGOCDb.set(`${message.guild.id}`, finalproduct, "goc")


    let n2 = EnmapGONCDb.get(`${message.guild.id}`, "gonc")
    let fix2 = parseInt(n2)
    let finalproduct2 = fix2 + 1;

    EnmapGONCDb.set(`${message.guild.id}`, finalproduct2, "gonc")

    let bots = message.guild.members.filter(member => member.user.bot).size;
    let users = message.guild.members.filter(member => !member.user.bot).size;

    let log = bot.channels.get(botconfig.commandlogs)

    let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()

    log.send("`" + `${timechange} [COMMAND]: 'odds', Author: ${message.author.username}, Server: ${message.guild.name} (${users}/${bots})` + "`")
}

module.exports.help = {
    name: "odds"
}