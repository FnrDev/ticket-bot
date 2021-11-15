const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
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
                }
            ])
        )
        interaction.reply({ content: "**👋 Select Category You Need Help For**", components: [row] });
        const filter = i => i.customId === 'help_menu' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter: filter, max: 1 });
        collector.on('collect', async i => {
            if (i.values.includes('general')) {
                await i.deferUpdate();
                let loopGeneralCommands = '';
                client.commands.filter(r => r.category === 'general').forEach(cmd => {
                    if (!cmd.description) return;
                    loopGeneralCommands += `**\`/${cmd.name}\`** - ${cmd.description}\n`
                });
                const embed = new MessageEmbed()
                .setTitle('General Commnads:')
                .setDescription(loopGeneralCommands)
                .setColor(interaction.guild.me.displayHexColor)
                .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
                return i.editReply({
                    embeds: [embed],
                    content: null,
                    components: []
                });
            }
            if (i.values.includes('info')) {
                await i.deferUpdate();
                let loopInfoCommands = '';
                client.commands.filter(r => r.category === 'info').forEach(cmd => {
                    if (!cmd.description) return;
                    loopInfoCommands += `**\`/${cmd.name}\`** - ${cmd.description}\n`
                });
                const embed = new MessageEmbed()
                .setTitle('Info Commnads:')
                .setDescription(loopInfoCommands)
                .setColor(interaction.guild.me.displayHexColor)
                .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }))
                return i.editReply({
                    embeds: [embed],
                    content: null,
                    components: []
                });
            }
        })
    }
}