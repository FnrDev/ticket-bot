module.exports = {
    name: "unblacklist",
    description: "Remove blacklist a user.",
    options: [
        {
            name: "user",
            description: "The user to unblacklist",
            type: 6,
            required: true
        }
    ],
    permission: "ADMINISTATOR",
    run: async(interaction, client) => {
        const user = interaction.options.getUser('user');

        // check if user blacklisted
        const isBlacklist = await client.db.get('blacklist', user.id);
        if (!isBlacklist) {
            return interaction.reply({
                content: ':x: This user is not blacklisted.',
                ephemeral: true
            })
        }

        await client.db.delete('blacklist', user.id);

        interaction.reply({
            content: `✅ ${user} (\`${user.id}\`) has been unblacklisted.`
        })
    }
}