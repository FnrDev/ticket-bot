const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../settings.json');

module.exports = {
    name: "new",
    description: "Create a new ticket",
    timeout: 10000,
    category: "ticket",
    usage: "/new",
    run: async(interaction, client) => {
        const getAllData = await client.db.all("tickets");
        const userHasTicket = getAllData.filter(r => r.data.user === interaction.user.id);
        const filterGuildTickets = getAllData.filter(r => r.data.guild === interaction.guild.id);
        const ticketCatgory = interaction.guild.channels.cache.find(r => r.type === 'GUILD_CATEGORY' && r.name === 'tickets');
        if (!ticketCatgory) {
            await interaction.guild.channels.create('tickets', { type: "GUILD_CATEGORY", reason: "Setup ticket category" })
            return interaction.reply({
                content: `:x: There was no ticket category, and i created a new one, use this command again.`,
                ephemeral: true
            })
        }
        if (userHasTicket.length > 0) {
            return interaction.reply({
                content: `:x: You already have opened ticket.`,
                ephemeral: true
            })
        }
        const ticketChannel = await interaction.guild.channels.create(`${interaction.user.username}-ticket`, {
            parent: ticketCatgory.id,
            permissionOverwrites: [
                {
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    id: interaction.user.id
                },
                {
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
                    id: config.modRole
                },
                {
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    id: interaction.guild.id
                }
            ],
            reason: "Created a new ticket"
        });
        await client.db.set('tickets', ticketChannel.id, {
            category: ticketCatgory.id,
            ticket: ticketChannel.id,
            guild: interaction.guild.id,
            user: interaction.user.id,
            open: true,
            number: filterGuildTickets.length + 1
        })
        const embed = new MessageEmbed()
        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription("Support will be with you shortly.")
        .setColor(config.embedColor)
        .setFooter(`${interaction.guild.name} Support`, interaction.guild.iconURL({ dynamic: true }))
        .setTimestamp()
        ticketChannel.send({
            content: interaction.user.toString(),
            embeds: [embed]
        })
        const successEmbed = new MessageEmbed()
        .setDescription(`**👋 Hey ${interaction.user.username}, You can ask your question in ${ticketChannel}**`)
        .setColor(config.successEmbedColor)
        interaction.reply({
            embeds: [successEmbed]
        });
        const logChannel = client.channels.cache.get(config.logChannel);
        if (!logChannel) return;
        const logEmbed = new MessageEmbed()
        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`${interaction.user} Created a new ticket ${ticketChannel}`)
        .addField("Ticket ID:", ticketChannel.id, true)
        .addField("Ticket Created At:", `<t:${Math.floor(ticketChannel.createdTimestamp / 1000)}:R>`, true)
        .setColor(config.embedColor)
        .setTimestamp()
        logChannel.send({
            embeds: [logEmbed]
        })
    }
}