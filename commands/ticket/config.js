const { Util } = require('discord.js');
const configOptions = require('../../configOptions');

module.exports = {
    name: "config",
    description: "Configuration ticket system.",
    options: configOptions,
    run: async(interaction, client) => {
        if (interaction.options.getSubcommand() === 'message') {
            const message = interaction.options.getString('message');
            let data = await client.db.get('config', interaction.guild.id);
            if (!data) data = {};
            data.message = message;
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
            const error = interaction.options.getString('error');
            const resovleSuccess = Util.resolveColor(success);
            const resloveError = Util.resolveColor(error);
            let data = await client.db.get('config', interaction.guild.id);
            if (!data) data = {};
            data.success = resovleSuccess;
            data.error = resloveError;
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
    }
}