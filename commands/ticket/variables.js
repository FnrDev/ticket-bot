module.exports = {
    name: "variables",
    description: "Show list of all available variables.",
    permission: "MANAGE_SERVER",
    run: async(interaction) => {
        interaction.reply({
            content: "`{username}` - the username of ticket owner.\n`{user}` - Mention the user.\n`{ticket}` - Mention ticket channel.\n`{ticketNumber}` - The ticket number.",
            ephemeral: true
        })
    }
}