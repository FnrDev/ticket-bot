const Discord = require('discord.js');

module.exports = {
    name: "close",
    description: "Close a ticket.",
    ticketOnly: true,
    modOnly: true,
    category: "ticket",
    usage: "/close",
    run: async(interaction, client) => {
        await interaction.channel.permissionOverwrites.set([
            {
                id: interaction.guild.id,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }
        ]);
        const ticketData = await client.db.get('tickets', interaction.channel.id);
        ticketData['open'] = false;
        await client.db.set('tickets', interaction.channel.id, ticketData);
        const config = await client.db.get('config', interaction.guild.id)
        const embed = new Discord.MessageEmbed()
        .setDescription(`**🔒 Ticket has been closed**`)
        .setColor(config.success)
        interaction.reply({
            embeds: [embed]
        })
    }
}