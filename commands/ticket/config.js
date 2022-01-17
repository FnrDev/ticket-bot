const { Util } = require('discord.js');

module.exports = {
    name: "config",
    description: "Config ticket system.",
    options: [
        {
            name: "role",
            description: "Role to view ticket channel",
            type: 8,
            required: true
        },
        {
            name: "category",
            description: "Category to ticket create in",
            type: 7,
            channel_types: [4],
            required: true
        },
        {
            name: "embed_color",
            description: "The hex color for embed color",
            type: 3
        },
        {
            name: "error_color",
            description: "The hex color for error embed color",
            type: 3
        },
        {
            name: "embed_content",
            description: "The content for the embed",
            type: 3
        }
    ],
    run: async(interaction, client) => {
        const category = interaction.options.getChannel('category');
        const role = interaction.options.getRole('role');
        const successColor = interaction.options.getString('embed_color') || null;
        const errorColor = interaction.options.getString('error_color') || null;
        const embedcontent = interaction.options.getString('embed_content') || null;
        const resolveEmbedColor = Util.resolveColor(successColor);
        const resolveErrorColor = Util.resolveColor(errorColor);
        await client.db.set('config', interaction.guild.id, {
            category: category.id,
            role: role.id,
            successColor: resolveEmbedColor,
            errorColor: resolveErrorColor,
            content: embedcontent
        });
        interaction.reply({
            content: `✅ Config has been set!\n**Role :** ${role.name}\n**Category :** ${category}\n**Embed Color :** ${successColor || 'No Color'}\n**Error Embed Color :** ${errorColor || 'No Color'}\n**Embed Content :** ${embedcontent}`
        })
    }
}