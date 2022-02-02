const { readdirSync } = require('fs');
module.exports = async(client) => {
    readdirSync("./commands/").map(async dir => {
        readdirSync(`./commands/${dir}/`).map(async cmd => {
            let pull = require(`../commands/${dir}/${cmd}`)
            client.commands.set(pull.name, pull)
        })
    })
}