module.exports = {
    name: "list",
    description: "Get list of all tickets in this server.",
    modOnly: true,
    options: [
        {
            name: "filter_by_user",
            description: "Filters tickets for specific user",
            type: 6
        },
        {
            name: "filter_opened_tickets",
            description: "Filters only opened tickets",
            type: 5
        },
        {
            name: "filter_closed_tickets",
            description: "Filters only closed tickets",
            type: 5
        }
    ],
    run: async(interaction, client) => {
        const user = interaction.options.getUser('filter_by_user');
        const onlyOpened = interaction.options.getBoolean('filter_opened_tickets');
        const onlyClosed = interaction.options.getBoolean('filter_closed_tickets');
        const getAllData = await client.db.all("tickets");
        const filterGuildTickets = getAllData.filter(r => r.data.guild === interaction.guild.id);
        // Filters by user
        if (user) {
            let num = 0;
            let filterUserStr = '';
            const filterTicketUser = getAllData.filter(r => r.data.guild === interaction.guild.id && r.data.user === user.id);
            filterTicketUser.forEach(ticket => {
                num++
                filterUserStr += `**#${num}** *Ticket* - <#${ticket.data.ticket}> *User* - <@${ticket.data.user}> *is ticket opened?* - ${ticket.data.open ? "✅ Yes" : ":x: No"}\n`
            });
            return interaction.reply({
                content: `*Filters by user : ${user} ( ${filterTicketUser.length} )*\n\n${filterUserStr}`
            })
        }
        // Filters opened tickets
        if (onlyOpened) {
            let num = 0;
            let openedStr = '';
            const filterOpenedTickets = getAllData.filter(r => r.data.guild === interaction.guild.id && r.data.open);
            filterOpenedTickets.forEach(ticket => {
                num++
                openedStr += `**#${num}** *Ticket* - <#${ticket.data.ticket}> *User* - <@${ticket.data.user}> *is ticket opened?* - ${ticket.data.open ? "✅ Yes" : ":x: No"}\n`
            });
            return interaction.reply({
                content: `*Filters by opened tickets ( ${filterOpenedTickets.length} )*\n\n${openedStr}`
            })
        }
        if (onlyClosed) {
            let num = 0;
            let closedStr = '';
            const filterClosedTickets = getAllData.filter(r => r.data.guild === interaction.guild.id && !r.data.open);
            filterClosedTickets.forEach(ticket => {
                num++
                closedStr += `**#${num}** *Ticket* - <#${ticket.data.ticket}> *User* - <@${ticket.data.user}> *is ticket opened?* - ${ticket.data.open ? "✅ Yes" : ":x: No"}\n`
            });
            return interaction.reply({
                content: `*Filters by closed tickets ( ${filterClosedTickets.length} )*\n\n${closedStr}`
            })
        }
        let str = '';
        let num = 0;
        filterGuildTickets.forEach(ticket => {
            num++
            str += `**#${num}** *Ticket* - <#${ticket.data.ticket}> *User* - <@${ticket.data.user}> *is ticket opened?* - ${ticket.data.open ? "✅ Yes" : ":x: No"}\n`
        })
        if (!str.length > 0) str = 'There are no tickets'
        interaction.reply({
            content: `*Total tickets in **${interaction.guild.name}** (**${filterGuildTickets.length}**)*\n\n${str}`
        })
    }
}