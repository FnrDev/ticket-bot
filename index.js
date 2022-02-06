const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'] });
const mysql = require('mysql-database');
const database = new mysql();
client.commands = new Discord.Collection();
client.slash = new Discord.Collection();
client.aliases = new Discord.Collection();
require('dotenv').config();
require('colors');

['hanlders', 'events'].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

(async () => {
  const db = await database.connect({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    database: process.env.DATABASE
  });
  client.db = db;
  db.on('connected', () => {
    console.log(`[DataBase] DataBase Connected.`.green);
  });
  db.create("tickets");
  db.create("config");
})();

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err}`.red);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err}`.red);
});

client.login(process.env.TOKEN);