const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {

  if (message.guild.me.hasPermission("MANAGE_MESSAGES")) { 
    message.delete() 
  }
  
  if (!args[0]) {
    let array = [
      "-Be extra creative! Don't just have simple answers like 'it's true",
      "-Check the current list (m\*list) for possible ideas/alternations!",
      "-Don't repeat other responses or get too specific (then only certain questions will work)!",
      "-Explicit answers are accepted (no derogatory terms please)",
      "-Make sure your answers are suitable for most questions!",
      "-Keep in mind that your request should be the equivelent of 'yes', 'no', 'maybe'"
    ]
    
    let b = bot.user.username;
    let tips = array.createText();
    let usage = new Discord.RichEmbed()
      .setAuthor(b + " - Request Help Menu")
      .setDescription("The `m\*req` command is designed for sending the author **responses** for 8ball that you think should be added!\n**Example:** `m\*req my sources say yes`\n\n**Tips:**\n" + tips)
      .setTimestamp()
      .setFooter(botconfig.footer, bot.user.displayAvatarURL)
    
    message.channel.send(usage)
    return;
  }
  
  if (!args[1]) {
    let nothing = new Discord.RichEmbed()
      .setColor("#ff0000")
      .setDescription("**ERROR:** Please submit a request (a response for 8ball) with at least **two** words! Most one worded answers are already listed!");

    message.channel.send(nothing).then(m => m.delete(15000));
    return;
  }
  
  let content = args.slice(0).join(" ");
  let b = bot.user.username;
  let req = new Discord.RichEmbed()
    .setAuthor(b + " - Submit A Request")
    .setDescription("Thank you for your request! It will be reviewed within the next 24 hours.\n\nYour Discord username, " + message.author.tag + ", has been collected for possible extra communication. If you would like to know if your response was added, check the list via help menu or allow DMs from everyone!")
    .addField("Your Request", content)
    .setTimestamp()
    .setFooter(botconfig.footer, bot.user.displayAvatarURL);
  message.channel.send(req)
  
  let bots = message.guild.members.filter(member => member.user.bot).size;
  let users = message.guild.members.filter(member => !member.user.bot).size;
  let log = bot.channels.get(botconfig.requests)
  let timechange = new Date(new Date().getTime() - (4 * 3600000)).toLocaleString()
  
  let logembed = new Discord.RichEmbed()
    .setColor("#00ff00")
    .setTitle("Incoming Request")
    .setDescription(`**__Server Details__**\n**Name:** ${message.guild.name}\n**ID:** ${message.guild.id}\n**Users/Bots:** (${users}/${bots})`)
    .addField("Author", message.author.tag)
    .addField("Request", content)
    .setFooter(timechange)
  log.send(logembed)
}

Array.prototype.createText = function () {
  return this.join("\n")
}

module.exports.help = {
    name: "req"
}
