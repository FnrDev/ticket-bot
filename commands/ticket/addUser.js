const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "add",
    description: "Add user to the ticket.",
    options: [
        {
            name: "user",
            description: "User you want to add to ticket.",
            type: 6,
            required: true
        }
    ],
    category: "ticket",
    usage: "/add **user:**Fnr#0017",
    timeout: 3000,
    modOnly: true,
    ticketOnly: true,
    run: async(interaction) => {
        const member = interaction.options.getMember('user');
        if (interaction.channel.permissionsFor(member).has('VIEW_CHANNEL')) {
            return interaction.reply({
                content: `:x: ${member} already in ticket channel.`,
                ephemeral: true
            });
        }
        try {
            const config = await client.db.get('config', interaction.guild.id)
            await interaction.channel.permissionOverwrites.edit(member, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true
            });
            const embed = new MessageEmbed()
            .setDescription(`**👌 Added ${member} to the ticket.**`)
            .setColor(config.successColor)
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