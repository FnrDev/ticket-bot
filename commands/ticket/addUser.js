const { MessageEmbed } = require('discord.js');
const settings = require('../../settings.json');

module.exports = {
    name: "add",
    description: "Add user to the ticket.",
    options: [
        {
            name: "user",
            description: "User you want to add to ticket.",
            type: 6,
            required: true
        }
    ],
    timeout: 3000,
    ticketOnly: true,
    run: async(interaction) => {
        const user = interaction.options.getUser('user');
        await interaction.channel.permissionOverwrites.edit(user, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        });
        const embed = new MessageEmbed()
        .setDescription(`**👌 Added ${user} to the ticket.**`)
        .setColor(settings.embedColor)
        interaction.reply({
            embeds: [embed]
        })
    }
}