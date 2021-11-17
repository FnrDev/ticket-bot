const Timeout = new Set()
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const humanizeDuration = require("humanize-duration");
const wait = require('util').promisify(setTimeout);
const settings = require('../../settings.json');

module.exports = async(client, interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
		if (!client.commands.has(interaction.commandName)) return;
		if (!interaction.guild) return;
		const command = client.commands.get(interaction.commandName)
		try {
			if (command.timeout) {
				if (Timeout.has(`${interaction.user.id}${command.name}`)) {
					const embed = new MessageEmbed()
					.setTitle('You are in timeout!')
					.setDescription(`You need to wait **${humanizeDuration(command.timeout, { round: true })}** to use command again`)
					.setColor(settings.errorEmbedColor)
					return interaction.reply({ embeds: [embed], ephemeral: true })
				}
			}
			if (command.permission) {
				if (!interaction.member.permissions.has(command.permission)) {
					const embed = new MessageEmbed()
					.setTitle('Missing Permission')
					.setDescription(`:x: You need \`${command.permission}\` permission to use this command`)
					.setColor(settings.errorEmbedColor)
					.setFooter(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
					.setTimestamp()
					return interaction.reply({ embeds: [embed], ephemeral: true })
				}
			}
			if (command.devs) {
				if (!process.env.OWNERS.includes(interaction.user.id)) {
					return interaction.reply({ content: ":x: Only devs can use this command", ephemeral: true });
				}
			}
			if (command.ownerOnly) {
				if (interaction.user.id !== interaction.guild.ownerId) {
					return interaction.reply({ content: "Only ownership of this server can use this command", ephemeral: true })
				}
			}
			if (command.ticketOnly) {
				const getTicketCategory = interaction.guild.channels.cache.find(r => r.type === 'GUILD_CATEGORY' && r.name === 'tickets');
				if (interaction.channel.parentId !== getTicketCategory.id) {
					return interaction.reply({
						content: ":x: You can't use this command outside ticket channel.",
						ephemeral: true
					})
				}
			}
			if (command.modOnly) {
				if (!interaction.member.roles.cache.has(settings.modRole)) {
					return interaction.reply({
						content: ":x: Only members with mod role can use this commnad.",
						ephemeral: true
					})
				}
			}
			command.run(interaction, client);
			Timeout.add(`${interaction.user.id}${command.name}`)
			setTimeout(() => {
				Timeout.delete(`${interaction.user.id}${command.name}`)
			}, command.timeout);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: ':x: There was an error while executing this command!', ephemeral: true });
		}
	}
	if (interaction.isButton()) {
		if (interaction.customId === 'close') {
			const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId('confirm_close')
				.setStyle('DANGER')
				.setLabel('Close')
			)
			interaction.reply({
				content: "Are you sure you would like to close this ticket?",
				components: [row]
			});
		}
		if (interaction.customId === 'confirm_close') {
			const msg = await interaction.deferReply({ fetchReply: true });
			await interaction.channel.permissionOverwrites.delete(interaction.user, `Closed ticket.`);
			await interaction.deleteReply();
			const embed = new MessageEmbed()
			.setDescription(`**🔐 Ticket closed by ${interaction.user}**`)
			.setColor(settings.embedColor)
			await msg.channel.send({
				embeds: [embed]
			});
			const dataEmbed = new MessageEmbed()
			.setDescription("**Support Team ticket controls**")
			.setColor(settings.embedColor)
			const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
				.setCustomId('staff_delete')
				.setStyle('DANGER')
				.setLabel('Delete')
				.setEmoji('🔒')
			)
			msg.channel.send({
				embeds: [dataEmbed],
				components: [row]
			});
		}
		if (interaction.customId === 'staff_delete') {
			const text = settings.deletTicketMessage.replace('{time}', humanizeDuration(settings.deleteTicketTime, { round: true }));
			interaction.reply(text);
			await wait(settings.deleteTicketTime);
			interaction.channel.delete(`By: ${interaction.user.tag}, Delete ticket.`);
		}
	}
} 