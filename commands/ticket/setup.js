const Discord = require('discord.js');
const settings = require('../../settings.json');

module.exports = {
    name: "setup",
    description: "Setup ticket category in your server",
    permission: "ADMINISTRATOR",
    run: async(interaction, client) => {
        const checkTicketCategory = interaction.guild.channels.cache.find(r => r.type === 'GUILD_CATEGORY' && r.name === 'tickets');
        if (checkTicketCategory) {
            const embed = new Discord.MessageEmbed()
            .setDescription("**:x: Ticket system is already has been created.**")
            .setColor(settings.errorEmbedColor)
            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
        await interaction.guild.channels.create("tickets", { type: "GUILD_CATEGORY", reason: "Setup ticket category." });
        const embed = new Discord.MessageEmbed()
        .setDescription(`**👌 Ticket system has been created.**`)
        .setColor(settings.successEmbedColor)
        interaction.reply({
            embeds: [embed]
        })
    }
}