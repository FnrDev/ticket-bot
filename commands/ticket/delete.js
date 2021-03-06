const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: "delete",
    description: "Delete a ticket channel.",
    modOnly: true,
    ticketOnly: true,
    category: "ticket",
    usage: "/delete",
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
                const config = await client.db.get('config', interaction.guild.id);
                const logChannel = interaction.guild.channels.cache.get(config.log);
                if (!logChannel) return;
                const embed = new MessageEmbed()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${interaction.user} deleted a **#${interaction.channel.name}** ticket.`)
                .addField("Ticket ID:", interaction.channel.id, true)
                .addField("Ticket Created At:", `<t:${Math.floor(interaction.channel.createdTimestamp / 1000)}:R>`, true)
                .addField("Ticket Deleted At:", `<t:${Math.floor(Date.now() / 1000)}:R>`, true)
                .setColor(config.success)
                .setTimestamp()
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                await logChannel.send({
                    embeds: [embed]
                });
                await client.db.delete('tickets', interaction.channel.id);
                return interaction.channel.delete(`By: ${interaction.user.tag}`);
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