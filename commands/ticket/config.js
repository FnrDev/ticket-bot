const { Util } = require('discord.js');
const configOptions = require('../../configOptions');

module.exports = {
    name: "config",
    description: "Configuration ticket system.",
    options: configOptions,
    run: async(interaction, client) => {
        if (interaction.options.getSubcommand() === 'message') {
            const message = interaction.options.getString('message');
            const content = interaction.options.getString('content') || null;
            let data = await client.db.get('config', interaction.guild.id);
            if (!data) data = {};
            data.message = message;
            data.content = content;
            await client.db.set('config', interaction.guild.id, data);
            return interaction.reply({
                content: "Config has been set!"
            })
        }
        if (interaction.options.getSubcommand() === 'category') {
            const channel = interaction.options.getChannel('category');
            let data = await client.db.get('config', interaction.guild.id);
            if (!data) data = {};
            data.category = channel.id;
            await client.db.set('config', interaction.guild.id, data);
            return interaction.reply({
                content: "Config has been set!"
            })
        }
        if (interaction.options.getSubcommand() === 'color') {
            const success = interaction.options.getString('success');
            const resovleSuccess = Util.resolveColor(success);
            let data = await client.db.get('config', interaction.guild.id);
            if (!data) data = {};
            data.success = resovleSuccess;
            await client.db.set('config', interaction.guild.id, data);
            return interaction.reply({
                content: "Config has been set!"
            }) 
        }
        if (interaction.options.getSubcommand() === 'role') {
            const staffRole = interaction.options.getRole('staff');
            const managersRole = interaction.options.getRole('managers');
            let data = await client.db.get('config', interaction.guild.id);
            if (!data) data = {};
            data.staff = staffRole.id;
            data.managers = managersRole.id;
            await client.db.set('config', interaction.guild.id, data);
            return interaction.reply({
                content: "Config has been set!"
            })
        }
        if (interaction.options.getSubcommand() === 'limit') {
            const limit = interaction.options.getInteger('limit');
            let data = await client.db.get('config', interaction.guild.id);
            if (!data) data = {};
            data.limit = limit;
            await client.db.set('config', interaction.guild.id, data);
            return interaction.reply({
                content: "Config has been set!"
            })
        }
        if (interaction.options.getSubcommand() === 'name') {
            const ticketName = interaction.options.getString('name');
            let data = await client.db.get('config', interaction.guild.id);
            if (!data) data = {};
            data.name = ticketName;
            await client.db.set('config', interaction.guild.id, data);
            return interaction.reply({
                content: "Config has been set!"
            })
        }
        if (interaction.options.getSubcommand() === 'log') {
            const logChannel = interaction.options.getChannel('channel');
            let data = await client.db.get('config', interaction.guild.id);
            if (!data) data = {};
            data.log = logChannel.id;
            await client.db.set('config', interaction.guild.id, data);
            return interaction.reply({
                content: "Config has been set!"
            })
        }
    }
}