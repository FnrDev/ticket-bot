module.exports = async(client, member) => {
    const fetchAllTickets = await client.db.all("tickets");
    const filterUserTickets = fetchAllTickets.filter(r => r.data.user === member.id);
    if (!filterUserTickets.length) return;
    filterUserTickets.forEach(ticketObj => {
        const ticket = member.guild.channels.cache.get(ticketObj.data.ticket);
        if (!ticket) return;
        ticket.send({
            content: `${member} **(${member.user.tag})** has left the server, if you want to delete this ticket you can use \`/delete\` command.` 
        })
    })
}