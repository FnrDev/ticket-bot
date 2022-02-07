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
        if (!config.staff || !config.managers) {
            return interaction.reply({
                content: `:x: i can't find staff / managers role, use \`/config role\` to add them.`,
                ephemeral: true
            })
        }
        const userHasTicket = getAllData.filter(r => r.data.user === interaction.user.id);
        const filterGuildTickets = getAllData.filter(r => r.data.guild === interaction.guild.id);
        const ticketCatgory = interaction.guild.channels.cache.get(config.category);
        if (!ticketCatgory) {
            return interaction.reply({
                content: `:x: I can\'t find this category, or category with id **${config.category}** has been deleted`,
                ephemeral: true
            })
        }
        if (userHasTicket.length + 1 > config.limit) {
            return interaction.reply({
                content: `:x: You execute ticket limit per user in this server`,
                ephemeral: true
            })
        }
        const ticketNumber = getAllData.filter(r => r.data.guild === interaction.guild.id).length + 1;
        const ticketName = config.name?.replace('{username}', interaction.user.username) || `ticket-${ticketNumber}`
        const ticketChannel = await interaction.guild.channels.create(ticketName, {
            parent: config.category,
            permissionOverwrites: [
                {
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    id: interaction.user.id
                },
                {
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
                    id: config.managers
                },
                {
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                    id: config.staff
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
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(config.message)
        .setColor(config.success)
        .setFooter({ text: `${interaction.guild.name} Support`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp()
        ticketChannel.send({
            content: config.content?.replaceAll('{username}', interaction.user.username)
            .replaceAll('{user}', interaction.user.toString())
            .replaceAll('{ticket}', interaction.channel.toString())
            .replaceAll('{ticketNumber}', ticketNumber),
            embeds: [embed]
        })
        const successEmbed = new MessageEmbed()
        .setDescription(`**👋 Hey ${interaction.user.username}, You can ask your question in ${ticketChannel}**`)
        .setColor(config.success)
        interaction.reply({
            embeds: [successEmbed]
        });
        const logChannel = interaction.guild.channels.cache.get(config.log)
        if (!logChannel) return;
        const logEmbed = new MessageEmbed()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`${interaction.user} Created a new ticket ${ticketChannel} (#${ticketChannel.name})`)
        .addField("Ticket ID:", ticketChannel.id, true)
        .addField("Ticket Created At:", `<t:${Math.floor(ticketChannel.createdTimestamp / 1000)}:R>`, true)
        .addField("Ticket Name:", ticketChannel.name, true)
        .setColor(config.success)
        .setTimestamp()
        logChannel.send({
            embeds: [logEmbed]
        })
    }
}