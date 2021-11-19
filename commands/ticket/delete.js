const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const settings = require('../../settings.json');

module.exports = {
    name: "delete",
    description: "Delete a ticket channel.",
    modOnly: true,
    ticketOnly: true,
    run: async(interaction, client) => {
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
                const logChannel = client.channels.cache.get(settings.logChannel);
                if (!logChannel) return;
                const embed = new MessageEmbed()
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`${interaction.user} deleted a **#${interaction.channel.name}** ticket.`)
                .addField("Ticket ID:", interaction.channel.id, true)
                .addField("Ticket Created At:", `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:R>`, true)
                .addField("Ticket Deleted At:", `<t:${Math.floor(Date.now() / 1000)}:R>`, true)
                .setColor(settings.embedColor)
                .setTimestamp()
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                await logChannel.send({
                    embeds: [embed]
                })
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