module.exports = async(client, channel) => {
    const getTicket = await client.db.get('tickets', channel.id);
    if (!getTicket) return;
    await client.db.delete('tickets', channel.id);
}