const Discord = require('discord.js');

module.exports = {
    name: "rename",
    description: "Rename ticket channel name.",
    options: [
        {
            name: "new_name",
            description: "New name for ticket channel.",
            type: 3,
            required: true
        }
    ],
    modOnly: true,
    ticketOnly: true,
    category: "ticket",
    usage: "/rename **new_name:**Premium",
    run: async(interaction, client) => {
        const name = interaction.options.getString('new_name');
        try {
            const config = await client.db.get('config', interaction.guild.id);
            await interaction.channel.edit({ name: name });
            const embed = new Discord.MessageEmbed()
            .setDescription(`👌 Renamed ticket channel to **${name}**`)
            .setColor(config.successColor);
            interaction.reply({
                embeds: [embed]
            });
        } catch (e) {
            return interaction.reply({
                content: e,
                ephemeral: true
            })
        }
    }
}