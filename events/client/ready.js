require('colors');

module.exports = async client => {
    const clientPresence = client.user.setActivity({ name: "GitHub: FnrDev", type: "WATCHING" });
    console.log(`[Discord API] Logged in as ${client.user.tag}`.green);
    console.log(`[Discord API] Loaded ${client.guilds.cache.size} Guilds`.yellow);
    console.log(`[Discord API] Loaded ${client.users.cache.size} Users`.yellow);
    console.log(`[Discord API] Loaded ${client.channels.cache.size} Channels`.yellow);
    console.log(`[Discord API] ${client.user.username} Presence has been set to "${clientPresence.activities[0].name}" with status "${clientPresence.status}"`.yellow);
};