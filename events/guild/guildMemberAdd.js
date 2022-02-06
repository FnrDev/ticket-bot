module.exports = async(client, member) => {
    const fetchAllTickets = await client.db.all("tickets");
    const filterUserTickets = fetchAllTickets.filter(r => r.data.user === member.id);
    if (!filterUserTickets.length) return;
    filterUserTickets.forEach(ticketObj => {
        const ticket = member.guild.channels.cache.get(ticketObj.data.ticket);
        if (!ticket) return;
        ticket.permissionOverwrites.edit(member, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true
        })
        ticket.send({
            content: `**${member.user.tag}** has left the server and re joined, and i automatically add member to ticket.` 
        })
    })
}