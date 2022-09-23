const { Routes, REST, Client, GatewayIntentBits } = require('discord.js');
const { table, getBorderCharacters } = require('table');
const { Bearing } = require('./commands/bearing');
const { AccuracyPrecision } = require('./commands/accuracyprecision');
require('dotenv').config();

// List of all commands
const ListOfCommands = [{
    name: 'bearing',
    description: 'Gives ACTUAL DIRECTION and COMPLEMENTARY DIRECTION based on bearing angle',
    options: [{
        name: 'angle',
        description: 'The known bearing angle',
        type: 4, // integer
        required: true
    }]
}, {
    name: 'acpc',
    description: 'Calculates the passed values based on the actual value if ACCURATE or PRECISE',
    options: [{
        name: 'list-of-values',
        description: 'The known list of values (decimal/number)',
        type: 3, // string
        required: true
    }, {
        name: 'actual-value',
        description: 'The actual value (decimal/number)',
        type: 10, // double
        required: true
    }]
}, {
    name: 'foxy',
    description: 'Solves for the RESULTANT VECTOR and EQUILIBRIUM VECTOR',
    options: [{
        name: 'vectors',
        description: 'The vectors separated by a comma e.g (35N 30 W of N, 10N 20 Degrees West of South)',
        type: 3, // string
        required: true
    }, {
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
	console.log('Bot is now ready!');
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
    } else if (interaction.commandName === 'acpc') {
        let values = interaction.options.getString('list-of-values');
        let actualValue = interaction.options.getNumber('actual-value');
        let temp = new AccuracyPrecision(values, actualValue);
        temp.main(); // Evaluate every method in the class
        await interaction.reply(`
            \`\`\` ${table(temp.data, { border: getBorderCharacters('ramac') })}\`\`\`
            **Actual value/Accepted value** = ${temp.actualValue}\n
            **Percent Error (%)** = ${temp.percentError}\n
            **Relative Deviation (%)** = ${temp.relativeDeviation}\n
            As a result, the conclusion is **${temp.conclusion}**
        `)
    } else if (interaction.commandName == 'foxy') {


    }

});

// Main
(async() => {
    try {
        console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), { body: ListOfCommands });
		console.log('Successfully reloaded application (/) commands.');
        // Login to Discord with your client's token
        client.login(TOKEN);

    } catch (err) {
        console.error(err);
    }
})();

