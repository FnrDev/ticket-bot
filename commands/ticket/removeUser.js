const { MessageEmbed } = require('discord.js');
const settings = require('../../settings.json');

module.exports = {
    name: "remove",
    description: "Remove user to the ticket.",
    options: [
        {
            name: "user",
            description: "User you want to remove from ticket.",
            type: 6,
            required: true
        }
    ],
    timeout: 3000,
    ticketOnly: true,
    modOnly: true,
    run: async(interaction) => {
        const user = interaction.options.getUser('user');
        await interaction.channel.permissionOverwrites.delete(user, `By: ${interaction.user.tag}, Removed user from ticket`);
        const embed = new MessageEmbed()
        .setDescription(`**👌 Removed ${user} from the ticket.**`)
        .setColor(settings.embedColor)
        interaction.reply({
            embeds: [embed]
        })
    }
}