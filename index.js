const { Routes, REST, Client, AttachmentBuilder, GatewayIntentBits } = require('discord.js');
const { table, getBorderCharacters } = require('table');
const { Bearing } = require('./commands/bearing');
const { AccuracyPrecision } = require('./commands/accuracyprecision');
const { FoxyMethod } = require('./commands/foxy');
const { Latex } = require('./commands/latex');
const { WordToChem } = require('./commands/weq')
const { Balancer } = require('./commands/balance')
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
        name: 'v1',
        description: 'The first vector e.g format (35N 30 W of N)',
        type: 3, // string
        required: true
    }, {
        name: 'v2',
        description: 'The second vector e.g format (10N 20 Degrees West of South)',
        type: 3, // string
        required: true
    }, {
        name: 'v3',
        description: 'The third vector',
        type: 3, // string
    }, {
        name: 'v4',
        description: 'The fourth vector',
        type: 3, // string
    }, {
        name: 'v5',
        description: 'The fifth vector',
        type: 3, // string
    }]
}, {
    name: 'latex',
    description: 'Write and output an equation into fancy LaTex',
    options: [{
        name: 'command',
        description: 'Write LaTex commands like \\pi, \\rightarrow, \\neq, etc...',
        type: 3, // string
        required: true
    }]
}, {
    name: 'kinematics',
    description: 'Tries to solve distance/time/velocity (initial or final)/acceleration',
    options: [{
        name: 'known-values',
        description: 'Values such as a, vf, vi, t, or d (separate by a comma or spaces) e.g (vf = 2km/s t=2s)',
        type: 3, // string
        required: true
    }, {
        name: 'solve-for',
        description: 'Can only be a, vf, vi, t, or d',
        type: 3, // string
        required: true
    }]
}, {
    name: 'weq',
    description: 'Converts a chemical word equation to its formula form',
    options: [{
        name: 'word-equation',
        description: 'The word equation string e.g (Glucose + oxygen = carbon dioxide + Water)',
        type: 3,
        required: true
    }]
}, { 
    name: 'balance',
    description: 'Balances a chemical equation',
    options: [{
        name: 'equation',
        description: 'The given chemical equation e.g (H2 + O2 = H2O)',
        type: 3, 
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
            Input: _${values}_ \`\`\` ${table(temp.data, { border: getBorderCharacters('ramac') })}\`\`\`
            **Actual value/Accepted value** = ${temp.actualValue}
            **Percent Error (%)** = ${temp.percentError}
            **Relative Deviation (%)** = ${temp.relativeDeviation}
            As a result, the conclusion is **${temp.conclusion}**
        `)
    } else if (interaction.commandName == 'foxy') {
        let vectors = [
            interaction.options.getString('v1'),
            interaction.options.getString('v2'),
            interaction.options.getString('v3'),
            interaction.options.getString('v4'),
            interaction.options.getString('v5'),
        ]
        // Filter method removes all null entries from the array
        let filteredVectors = vectors.filter(i => i);
        let temp = new FoxyMethod(filteredVectors)
        temp.main()
        await interaction.reply(`
            Input: _${filteredVectors.join(', ')}_ \`\`\` ${table(temp.data, { border: getBorderCharacters('ramac') })}\`\`\`
            **θ₁** = ${temp.theta1}
            **θ₂** = ${temp.theta2}\n
            **RV** = ${temp.rv[0]}
                      ${temp.rv[1]}\n
            **RE** = ${temp.re[0]}
                      ${temp.re[1]}
        `)
    } else if (interaction.commandName == 'latex') {
        let cmd = interaction.options.getString('command');
        let temp = new Latex(cmd)
        await temp.main() // Evaluate all methods (main)
        
        let attc = new AttachmentBuilder(temp.pngBuffer, { name: `latex_eq.png` })
        await interaction.reply({ 
            embeds: [{ // Send embedded latex command
                description: `**LaTex Command:** \`${cmd}\``,
                image: {
                    url: 'attachment://latex_eq.png'
                }
            }], 
            files: [attc]
        })
    } else if (interaction.commandName == 'kinematics') {
        // TODO: To be continued   
    } else if (interaction.commandName == 'weq') {
        let wordEqForm = interaction.options.getString('word-equation')
        let temp = new WordToChem(wordEqForm)
        await interaction.reply(`
            The answer to **${wordEqForm}** is converted as: \`\`\`${temp.equation}\`\`\`
        `)
    } else if (interaction.commandName == 'balance') {
        let unbalancedChemFormula = interaction.options.getString('equation');
        let temp = new Balancer(unbalancedChemFormula)
        await interaction.reply(`
            The balanced chemical formula for **${unbalancedChemFormula}** is: \`\`\`${temp.equation}\`\`\`
        `)
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

