const { bot } = require("../index.js");
const botconfig = require("../botconfig.json");

bot.on("channelDelete", async channel => {

    let theEchannelid = EnmapEChannelIDDb.get(`${channel.guild.id}`, "echannelid")

    if (channel.id === theEchannelid) {

        EnmapEChannelIDDb.delete(channel.guild.id)

        const eChannel = EnmapEChannelIDDb.set(channel.guild.id, {
            echannelid: 0,
            id: channel.guild.id
        });
        await EnmapEChannelIDDb.inc(channel.guild.id, "echannelid");
    }
});