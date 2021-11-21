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
    usage: "/remove **user:**Fnr#0017",
    category: "ticket",
    run: async(interaction) => {
        const member = interaction.options.getMember('user');
        if (!interaction.channel.permissionsFor(member).has('VIEW_CHANNEL')) {
            return interaction.reply({
                content: `:x: ${member} is not in ticket channel.`,
                ephemeral: true
            });
        }
        try {
            await interaction.channel.permissionOverwrites.delete(member, `By: ${interaction.user.tag}, Removed user from ticket`);
            const embed = new MessageEmbed()
            .setDescription(`**👌 Removed ${member} from the ticket.**`)
            .setColor(settings.embedColor)
            interaction.reply({
                embeds: [embed]
            })
        } catch (e) {
            return interaction.reply({
                content: e,
                ephemeral: true
            })
        }
    }
}