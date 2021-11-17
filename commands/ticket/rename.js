const Discord = require('discord.js');
const settings = require('../../settings.json');

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
    permission: "MANAGE_CHANNELS",
    ticketOnly: true,
    run: async(interaction) => {
        const name = interaction.options.getString('new_name');
        await interaction.channel.edit({ name: name });
        const embed = new Discord.MessageEmbed()
        .setDescription(`👌 Renamed ticket channel to **${name}**`)
        .setColor(settings.embedColor);
        interaction.reply({
            embeds: [embed]
        });
    }
}