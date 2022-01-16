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
        }
    ],
    run: async(interaction, client) => {
        const category = interaction.options.getChannel('category');
        const role = interaction.options.getRole('role');
        const successColor = interaction.options.getString('embed_color') || null;
        const resolveColor = Util.resolveColor(successColor)
        await client.db.set('config', interaction.guild.id, {
            category: category.id,
            role: role.id,
            embedColor: resolveColor
        });
        interaction.reply({
            content: `✅ Config has been set!\n**Role :** ${role.name}\n**Category :** ${category}\n**Embed Color :** ${successColor || 'No Color'}`
        })
    }
}