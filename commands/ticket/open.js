module.exports = {
    name: "open",
    description: "Reopen ticket channel.",
    ticketOnly: true,
    modOnly: true,
    category: "ticket",
    usage: "/open",
    run: async(interaction, client) => {
        const getTicketData = await client.db.get("tickets", interaction.channel.id);
        if (getTicketData.open) {
            return interaction.reply({
                content: `:x: This ticket is already opened`,
                ephemeral: true
            })
        }
        getTicketData['open'] = true;
        await client.db.set('tickets', interaction.channel.id, getTicketData);
        await interaction.channel.permissionOverwrites.edit(getTicketData.user, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        });
        interaction.reply({
            content: `✅ Successfully re opened this ticket.`
        })
    }
}