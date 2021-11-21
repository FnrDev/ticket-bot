const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const humanizeDuration = require("humanize-duration");

module.exports = {
    name: "help",
    description: "Get list of all bot commands",
    options: [
        {
            name: "command",
            description: "Command you need help for",
            type: 3
        }
    ],
    usage: "/ping",
    category: "info",
    run: async(interaction, client) => {
        try {
            const command = interaction.options.getString('command');
            if (command) {
            const cmd = client.commands.get(command.toLowerCase());
            if (!cmd) {
                return interaction.reply({ content: `I can\'t find \`${cmd}\` command`, ephemeral: true })
            }
            const embed = new MessageEmbed()
            .setColor(interaction.guild.me.displayHexColor)
            if (cmd.name) {
                embed.setTitle(`Command: ${cmd.name}`)
            }
            if (cmd.description) {
                embed.setDescription(cmd.description)
            }
            if (cmd.usage) {
                embed.addField('Usage:', cmd.usage)
            }
            if (cmd.timeout) {
                embed.addField('Timeout:', humanizeDuration(cmd.timeout, { round: true }))
            }
            return interaction.reply({ embeds: [embed] })
        }
        // await interaction.deferReply();
            const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('help_menu')
                .setPlaceholder('Select Command Category.')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions([
                    {
                        label: "General",
                        emoji: "⚙",
                        description: "Show all commands in general category.",
                        value: "general"
                    },
                    {
                        label: "Info",
                        description: "Show all commands in info category.",
                        emoji: "ℹ",
                        value: "info"
                    },
                    {
                        label: "Ticket",
                        description: "Show all commands in ticket category.",
                        emoji: "📃",
                        value: "ticket"
                    }
                ])
            )
            interaction.reply({ content: "**👋 Select Category You Need Help For**", components: [row] });
            const filter = i => i.customId === 'help_menu' || 'selected_command' && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter: filter, max: 2, componentType: "SELECT_MENU" });
            collector.on('collect', async i => {
                if (i.values.includes('general')) {
                    await i.deferUpdate();
                    const loopArray = [];
                    if (client.commands.filter(r => r.category === 'general').size === '25') {
                        loopArray.slice(0, 25)
                    }
                    client.commands.filter(r => r.category === "general").forEach(cmd => {
                        loopArray.push({
                            label: cmd.name,
                            value: cmd.name,
                            description: cmd.description,
                            emoji: "⚙"
                        })
                    })
                    const commandRow = row.setComponents(
                        new MessageSelectMenu()
                        .setCustomId('general_cmd')
                        .setPlaceholder('General Commands')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions(loopArray)
                    )
                    return i.editReply({
                        content: "**Select what command you need help for.**",
                        components: [commandRow]
                    })
                }
                if (i.values.includes('info')) {
                    await i.deferUpdate();
                    const loopArray = [];
                    if (client.commands.filter(r => r.category === 'info').size === '25') {
                        loopArray.slice(0, 25)
                    }
                    client.commands.filter(r => r.category === "info").forEach(cmd => {
                        loopArray.push({
                            label: cmd.name,
                            value: cmd.name,
                            description: cmd.description,
                            emoji: "ℹ"
                        })
                    })
                    const commandRow = row.setComponents(
                        new MessageSelectMenu()
                        .setCustomId('info_cmd')
                        .setPlaceholder('Info Commands')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions(loopArray)
                    )
                    return i.editReply({
                        content: "**Select what command you need help for.**",
                        components: [commandRow]
                    })
                }
                if (i.values.includes('ticket')) {
                    await i.deferUpdate();
                    const loopArray = [];
                    if (client.commands.filter(r => r.category === 'ticket').size > 25) {
                        loopArray.slice(0, 25)
                    }
                    client.commands.filter(r => r.category === "ticket").forEach(cmd => {
                        loopArray.push({
                            label: cmd.name,
                            value: cmd.name,
                            description: cmd.description,
                            emoji: "📃"
                        })
                    })
                    const commandRow = row.setComponents(
                        new MessageSelectMenu()
                        .setCustomId('ticket_cmd')
                        .setPlaceholder('Ticket Commands')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions(loopArray)
                    )
                    return i.editReply({
                        content: "**Select what command you need help for.**",
                        components: [commandRow]
                    })
                }
            })
        } catch (e) {
            return false;
        }
    }
}