const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../settings.json');

module.exports = {
    name: "new",
    description: "Create a new ticket",
    timeout: 10000,
    category: "ticket",
    usage: "/new",
    run: async(interaction, client) => {
        const ticketCatgory = interaction.guild.channels.cache.find(r => r.type === 'GUILD_CATEGORY' && r.name === 'tickets');
        if (!ticketCatgory) {
            const embed = new MessageEmbed()
            .setDescription('**:x: You need to setup ticket system before creating a new ticket, use command \`/setup\` to setup ticket system.**')
            .setColor(config.embedColor)
            return interaction.reply({
                embeds: [embed],
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
        const embed = new MessageEmbed()
        .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription("Support will be with you shortly.\nTo close this ticket click 🔒 button.")
        .setColor(config.embedColor)
        .setFooter(`${interaction.guild.name} Support`, interaction.guild.iconURL({ dynamic: true }))
        .setTimestamp()
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('close')
            .setStyle('DANGER')
            .setLabel('Close Ticket')
            .setEmoji('🔒')
        )
        ticketChannel.send({
            content: interaction.user.toString(),
            embeds: [embed],
            components: [row]
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