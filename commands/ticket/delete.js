const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "delete",
    description: "Delete a ticket channel.",
    modOnly: true,
    ticketOnly: true,
    run: async(interaction) => {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('delete_ticket')
            .setStyle('DANGER')
            .setLabel('Delete')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('cancel')
            .setStyle('SECONDARY')
            .setLabel('Cancel')
        )
        await interaction.reply({
            content: `Are you sure to delete **#${interaction.channel.name}** ticket.`,
            fetchReply: true,
            components: [row]
        });
        const filter = i => i.customId === 'delete_ticket' || 'cancel' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter: filter, time: 20000 });
        collector.on('collect', async i => {
            if (i.customId === 'delete_ticket') {
                return interaction.channel.delete();
            }
            if (i.customId === 'cancel') {
                await interaction.deleteReply();
            }
        });
        collector.on('end', async i => {
            try {
                await interaction.deleteReply();
            } catch (e) {
                return false;
            }
        })
    }
}