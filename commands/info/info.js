const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const humanizeDuration = require("humanize-duration");

module.exports = {
    name: "info",
    description: "Get info about bot",
    timeout: 5000,
    usage: "/info",
    category: "info",
    run: async(interaction, client) => {
        const loopGuilds = [];
        client.guilds.cache.forEach((guild, i) => {
            loopGuilds.push(guild.memberCount);
        });
        let TotalUsers = 0;
        for (let i = 0; i < loopGuilds.length; i++) {
            if (isNaN(loopGuilds[i])) continue;
            TotalUsers += loopGuilds[i];
        }
        const embed = new MessageEmbed()
        .setTitle('__Bot Stats__')
        .setColor('RANDOM')
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`© ${client.user.username} - Coded By Fnr#0017`)
        .addFields(
            {
                name: "<a:IconBot:855532513770340424> Total Guilds: ",
                value: client.guilds.cache.size.toLocaleString(),
                inline: true
            },
            {
                name: "<a:IconUsers:856146782451007508> Total Users: ",
                value: TotalUsers.toLocaleString(),
                inline: true
            },
            {
                name: "<:discord_bot_dev:747685855682101309> Developer: ",
                value: `[Fnr#0017](https://twitter.com/Fnr_8)`,
                inline: true
            },
            {
                name: "<a:wait:767349330361057350> Bot Uptime: ",
                value: humanizeDuration(client.uptime, { round: true }),
                inline: true
            },
        )
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setStyle('LINK')
            .setLabel('Bot Link')
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=92160&scope=bot%20applications.commands`)
        )
        interaction.reply({ embeds: [embed], components: [row] })
    }
}