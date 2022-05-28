module.exports = {
    name: "blacklist",
    description: "Blacklist a user from creating a ticket.",
    options: [
        {
            name: "user",
            description: "The user to blacklist",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "The reason of blacklist",
            type: 3
        }
    ],
    permission: "ADMINISTATOR",
    run: async(interaction, client) => {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // check if user blacklisted
        const isBlacklist = await client.db.get('blacklist', user.id);
        if (isBlacklist) {
            return interaction.reply({
                content: ':x: This user already blacklisted.',
                ephemeral: true
            })
        }

        await client.db.set('blacklist', user.id, { user: user.id, reason });

        interaction.reply({
            content: `✅ ${user} (\`${user.id}\`) has been blacklisted.`
        })
    }
}