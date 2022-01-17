const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "new",
    description: "Create a new ticket",
    timeout: 3000,
    category: "ticket",
    usage: "/new",
    run: async(interaction, client) => {
        const getAllData = await client.db.all("tickets");
        const config = await client.db.get('config', interaction.guild.id);
        if (!config) {
            return interaction.reply({
                content: ":x: There are no config for this server, please use \`/config\` commnad before creating new ticket",
                ephemeral: true
            })
        }
        const userHasTicket = getAllData.filter(r => r.data.user === interaction.user.id);
        const filterGuildTickets = getAllData.filter(r => r.data.guild === interaction.guild.id);
        const ticketCatgory = interaction.guild.channels.cache.get(config.category);
        if (!ticketCatgory) {
            return interaction.reply({
                content: `:x: You need to setup config for ticket category\nUse \`/config\` command.`,
                ephemeral: true
            })
        }
        if (userHasTicket.length > config.limit_per_user) {
            return interaction.reply({
                content: `:x: You execute ticket limit per user for this server`,
                ephemeral: true
            })
        }
        const ticketName = config.name || `${interaction.user.username}-ticket`
        const ticketChannel = await interaction.guild.channels.create(ticketName, {
            parent: config.category,
            permissionOverwrites: [
                {
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    id: interaction.user.id
                },
                {
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
                    id: config.role
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
        .setDescription(config.content)
        .setColor(config.successColor)
        .setFooter(`${interaction.guild.name} Support`, interaction.guild.iconURL({ dynamic: true }))
        .setTimestamp()
        ticketChannel.send({
            content: interaction.user.toString(),
            embeds: [embed]
        })
        const successEmbed = new MessageEmbed()
        .setDescription(`**👋 Hey ${interaction.user.username}, You can ask your question in ${ticketChannel}**`)
        .setColor(config.successColor)
        interaction.reply({
            embeds: [successEmbed]
        });
        const logChannel = client.channels.cache.get(config.log_channel);
        if (!logChannel) return;
        const logEmbed = new MessageEmbed()
        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`${interaction.user} Created a new ticket ${ticketChannel}`)
        .addField("Ticket ID:", ticketChannel.id, true)
        .addField("Ticket Created At:", `<t:${Math.floor(ticketChannel.createdTimestamp / 1000)}:R>`, true)
        .addField("Ticket Name:", ticketChannel.name, true)
        .setColor(config.embedColor)
        .setTimestamp()
        logChannel.send({
            embeds: [logEmbed]
        })
    }
}