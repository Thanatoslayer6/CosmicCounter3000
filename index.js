const { Routes, REST, Client, GatewayIntentBits } = require('discord.js');
const { Bearing } = require('./bearing');
require('dotenv').config();

// List of all commands
const commands = [{
    name: 'bearing',
    description: 'Gives actual direction and complementary direction',
    options: [{
        name: 'angle',
        description: 'the bearing angle',
        type: 4,
        required: true
    }]
}];

// Env variables
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const rest = new REST({ version: '10' }).setToken(TOKEN);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Handle slash commands 
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'bearing') {
        // Capture the argument presented by the user (the bearing angle as an integer)
        let angle = interaction.options.getInteger('angle');
        let temp = new Bearing(angle);
        let actualDirection = temp.actualDirection();
        let complementaryDirection = temp.complementaryDirection(actualDirection);
        await interaction.reply(`The actual direction is: **${actualDirection}**\nThe complementary direction is: **${complementaryDirection}**`);
    }
});

(async() => {
    try {
        console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), { body: commands });
		console.log('Successfully reloaded application (/) commands.');
        // Login to Discord with your client's token
        client.login(TOKEN);

    } catch (err) {
        console.error(err);
    }
})();

