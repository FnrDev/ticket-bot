const { Util, MessageEmbed } = require('discord.js');
const configOptions = require('../../configOptions');

module.exports = {
    name: "config",
    description: "Config ticket system.",
    options: configOptions,
    run: async(interaction, client) => {
        const category = interaction.options.getChannel('category');
        const role = interaction.options.getRole('role');
        const successColor = interaction.options.getString('embed_color') || null;
        const errorColor = interaction.options.getString('error_color') || null;
        const embedcontent = interaction.options.getString('embed_content') || 'Support will be with you shortly.';
        const limit = interaction.options.getInteger('limit_per_user') || 1;
        const defaultName = interaction.options.getString('default_name') || null;
        const logChannel = interaction.options.getChannel('log_channel');
        const resolveEmbedColor = Util.resolveColor(successColor);
        const resolveErrorColor = Util.resolveColor(errorColor);
        await client.db.set('config', interaction.guild.id, {
            category: category.id,
            role: role.id,
            successColor: resolveEmbedColor,
            errorColor: resolveErrorColor,
            content: embedcontent,
            limit_per_user: limit,
            name: defaultName,
            log_channel: logChannel ? logChannel.id : null
        });
        const embed = new MessageEmbed()
        .setAuthor(`${interaction.guild.name} Config`, interaction.guild.iconURL())
        .setColor(interaction.guild.me.displayHexColor)
        .addFields(
            {
                name: "Role :",
                value: role.name
            },
            {
                name: "Category :",
                value: category.toString()
            },
            {
                name: "Embed Color :",
                value: successColor || 'No Color'
            },
            {
                name: "Error Embed Color :",
                value: errorColor || 'No Color'
            },
            {
                name: "Embed Content :",
                value: embedcontent || 'No Embed Content'
            },
            {
                name: "Default Ticket Name :",
                value: defaultName || 'No Default Name'
            },
            {
                name: "Log Channel :",
                value: logChannel ? logChannel.toString() : "No Log Channel"
            }
        )
        interaction.reply({
            embeds: [embed],
            content: "**✅ Config has been set! 🥳**"
        })
    }
}