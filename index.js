const { Routes, REST, Client, EmbedBuilder, AttachmentBuilder, GatewayIntentBits } = require('discord.js');
const { table, getBorderCharacters } = require('table');
const { Bearing, BearingCommand } = require('./commands/bearing');
const { AccuracyPrecision, AccuracyPrecisionCommand } = require('./commands/accuracyprecision');
const { FoxyMethod, FoxyMethodCommand } = require('./commands/foxy');
const { Latex, LatexCommand } = require('./commands/latex');
const { WordToChem, WordToChemCommand } = require('./commands/weq')
const { Balancer, BalancerCommand } = require('./commands/balance')
const { Kinematics, KinematicsCommand } = require('./commands/kinematics')
const { Stoichiometry, StoichiometryPercentage, StoichiometryCommand, StoichiometryPercentageCommand } = require('./commands/stoichiometry')
const { VerticallyDownward, VerticallyUpward, HorizontalProjection, ProjectedAtAnAngle, VerticallyDownwardCommand, VerticallyUpwardCommand, HorizontalProjectionCommand, ProjectedAtAnAngleCommand } = require('./commands/projectilemotion')
const { ChemTable, ChemTableCommand } = require('./commands/chemtable')
const { Electrostatics, ElectrostaticsCommand } = require('./commands/electrostatics')
// const { InitiateOpenAI, InitiateGPTchat, GenerateOpenAiImage, GenerateOpenAiImageCommand } = require('./commands/ai.js')
// const { InitiateOpenAI, InitiateGPTchat, GenerateOpenAiImage, GenerateOpenAiImageCommand, GenerateGPTchatTextCommand, GenerateGPTchatText } = require('./commands/ai')
// const { InitiateOpenAI, InitiateChatGPT, GenerateOpenAiImage, GenerateChatGPTtextCommand, GenerateOpenAiImageCommand, GenerateChatGPTtext } = require('./commands/ai');
require('dotenv').config();

// List of all commands
const ListOfCommands = [ 
    BearingCommand, 
    AccuracyPrecisionCommand, 
    FoxyMethodCommand,
    LatexCommand, 
    KinematicsCommand,
    WordToChemCommand, 
    BalancerCommand, 
    StoichiometryCommand, 
    StoichiometryPercentageCommand, 
    VerticallyDownwardCommand, 
    VerticallyUpwardCommand,
    HorizontalProjectionCommand, 
    ProjectedAtAnAngleCommand,
    ChemTableCommand,
    ElectrostaticsCommand,
    // GenerateOpenAiImageCommand,
    // GenerateChatGPTtextCommand
];

// Env variables
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
// const OPENAI_KEY = process.env.OPENAI_KEY;
// const OPENAI_EMAIL = process.env.OPENAI_EMAIL;
// const OPENAI_PASSWORD = process.env.OPENAI_PASSWORD;
// const BROWSER_EXECUTABLE_PATH = process.env.BROWSER_EXECUTABLE_PATH;

// OpenAI & ChatGpt instance, variables
// let openai = InitiateOpenAI(OPENAI_KEY);
// let chatgpt = null, conversation = null;

// Discord.js (rest, client)
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
        try {
            let temp = new Bearing(angle);
            let actualDirection = temp.actualDirection();
            let complementaryDirection = temp.complementaryDirection(actualDirection);
            await interaction.reply(`The actual direction is: **${actualDirection}**\nThe complementary direction is: **${complementaryDirection}**`);
        } catch (exception) {
            console.error(exception)
            await interaction.reply(`Can't do bearings for the given, probably fix the input?\nError Log: \`${exception}\``)
        }
    } else if (interaction.commandName === 'acpc') {
        let values = interaction.options.getString('list-of-values');
        let actualValue = interaction.options.getNumber('actual-value');
        try {
            let temp = new AccuracyPrecision(values, actualValue);
            temp.main(); // Evaluate every method in the class

            await interaction.reply(`
            Input: _${values}_ \`\`\` ${table(temp.data, { border: getBorderCharacters('ramac') })}\`\`\`
            **Actual value/Accepted value** = ${temp.actualValue}
            **Percent Error (%)** = ${temp.percentError}
            **Relative Deviation (%)** = ${temp.relativeDeviation}
            As a result, the conclusion is **${temp.conclusion}**`)
        } catch (exception) {
            console.error(exception)
            await interaction.reply(`Can't do accuracy & precision for the given, probably fix the input?\nError Log: \`${exception}\``)
        }
    } else if (interaction.commandName == 'foxy') {
        let vectors = [
            interaction.options.getString('v1'),
            interaction.options.getString('v2'),
            interaction.options.getString('v3'),
            interaction.options.getString('v4'),
            interaction.options.getString('v5'),
        ]
        try {
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
        } catch (exception) {
            console.error(exception)
            await interaction.reply(`Can't do foxy method for the given, probably fix the input?\nError Log: \`${exception}\``)
        }
    } else if (interaction.commandName == 'latex') {
        // No error checking for now...
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
        let variables = interaction.options.getString('known-values')
        let toSolveFor = interaction.options.getString('solve-for')
        try {
            // KINEMATICS
            let temp1 = new Kinematics(variables, toSolveFor)
            // LATEX
            let temp2 = new Latex(temp1.equationInLatex)
            await temp2.main() // Evaluate all methods (main)
            
            let attc = new AttachmentBuilder(temp2.pngBuffer, { name: `latex_eq.png` })

            // SEND!!!!!!!!
            await interaction.reply({ 
                embeds: [{ // Send embedded latex command
                    description: `**Given:** \`${temp1.knownValuesToString()}\`\n**Find:** \`${temp1.solveFor}\`\n**Answer:** \`${temp1.result}\``,
                    image: {
                        url: 'attachment://latex_eq.png'
                    }
                }], 
                files: [attc]
            })
        } catch (exception) {
            console.error(exception)
            await interaction.reply(`Can't do kinematics, please check your input below?\n\`${variables} -> solve for ${toSolveFor}\`\nError Log: \`${exception}\``)
        }
        
    } else if (interaction.commandName == 'weq') {
        let wordEqForm = interaction.options.getString('word-equation')
        try { 
            let temp = new WordToChem(wordEqForm)
            await interaction.reply(`
            The answer to **${wordEqForm}** is converted as: \`\`\`${temp.equation}\`\`\`
            `)
        } catch (exception) {
            // Just incase the user inputs a non-existent element in the list
            console.error(exception)
            await interaction.reply(`Can't convert the word equation **${wordEqForm}**, please check the elements/spelling\nError Log: \`${exception}\``) 
        }
    } else if (interaction.commandName == 'balance') {
        let unbalancedChemFormula = interaction.options.getString('equation');
        try {
            let temp = new Balancer(unbalancedChemFormula)
            await interaction.reply(`
            The balanced chemical formula for **${unbalancedChemFormula}** is: \`\`\`${temp.equation}\`\`\`
            `)
        } catch (exception) {
            if (unbalancedChemFormula.toLowerCase() == "sir naval") {
                await interaction.reply(`**Warning!** _Input is too reactive! cannot balance!_\nhttps://imgflip.com/i/6xizng`)
            } else {
                console.error(exception)
                await interaction.reply(`Error! can't balance: **${unbalancedChemFormula}**, please check if its a chemical equation like **Na + Cl = NaCl**\nError Log:\`${exception}\``)
            }
        }
    } else if (interaction.commandName == 'stoichiometry') {
        let chemEquation = interaction.options.getString('equation');
        let givenInfo = interaction.options.getString('given');
        let solveFor = interaction.options.getString('solve-for');
        try {
            // STOICHIOMETRY
            let temp1 = new Stoichiometry(chemEquation, givenInfo, solveFor);

            // LATEX
            let temp2 = new Latex(temp1.equationInLatex)
            await temp2.main() // Evaluate all methods (main)

            let attc = new AttachmentBuilder(temp2.pngBuffer, { name: `latex_eq.png` })

            // SEND!!!!!!!!
            await interaction.reply({ 
                embeds: [{ // Send embedded latex command
                    description: `**Given:** \`${givenInfo}\`\n**Find:** \`${solveFor}\`\n**Balanced Equation:** \`${temp1.balancedEquation}\`\n**Answer:** \`${temp1.result}\``,
                    image: {
                        url: 'attachment://latex_eq.png'
                    }
                }], 
                files: [attc]
            })
        } catch(exception) {
            // await interaction.reply(`Error! can't do stoichiometry for the given`)
            console.error(exception)
            await interaction.reply(`Can't do stoichiometry i dunno, maybe check input?\nError Log:\`${exception}\``)
        }
    } else if (interaction.commandName == 'stoichiometry-percentage') {
        let percent = interaction.options.getString('percent')
        let solute = interaction.options.getString('solute')        
        let solution = interaction.options.getString('solution')
        let method = interaction.options.getString('method')
        try {
            let temp1 = new StoichiometryPercentage(percent, solute, solution, method)
            // LATEX
            let temp2 = new Latex(temp1.equationInLatex)
            await temp2.main() // Evaluate all methods (main)

            let attc = new AttachmentBuilder(temp2.pngBuffer, { name: `latex_eq.png` })

            // SEND!!!!!!!!
            await interaction.reply({ 
                embeds: [{ // Send embedded latex command
                    description: temp1.givenInfo,
                    image: {
                        url: 'attachment://latex_eq.png'
                    }
                }], 
                files: [attc]
            })
        } catch (exception) {
            // await interaction.reply(`Error! can't do stoichiometry percentages for the given`)
            console.error(exception)
            await interaction.reply(`Can't do stoichiometry percentages i dunno, maybe check input?\nError Log:\`${exception}\``)
        }
    } else if (interaction.commandName == 'downward-motion') {
        let sf = interaction.options.getInteger('round-to-sigfig')
        let vi = interaction.options.getString('initial-velocity')
        let vf = interaction.options.getString('final-velocity')
        let d = interaction.options.getString('height')
        let t = interaction.options.getString('time')
        try {
            await interaction.deferReply(); // Use this to maximize time for all computations, also shows that bot is thinking
            let temp = new VerticallyDownward(vi, vf, d, t, sf);
            // LATEX
            let [ formula1, formula2] = [new Latex(temp.equationInLatex[0]), new Latex(temp.equationInLatex[1])];
            await formula1.main() // Evaluate all methods (main)
            await formula2.main()
            let [ attc1, attc2 ] = [new AttachmentBuilder(formula1.pngBuffer, { name: `latex_eq1.png` }), new AttachmentBuilder(formula2.pngBuffer, { name: `latex_eq2.png` })]

            // SEND!!!!!!!!
            await interaction.reply({ 
                embeds: [{ // Send embedded latex command
                    description: temp.givenInfo,
                    image: {
                        url: 'attachment://latex_eq1.png'
                    }
                }, {
                    image:  {
                        url: 'attachment://latex_eq2.png'
                    }
                }],
                files: [attc1, attc2]
            })
        } catch (exception) {
            // await interaction.reply(`Error! can't do physics i dunno, maybe check input?`)
            console.error(exception)
            await interaction.reply(`Can't do physics [vertically downward motion] i dunno, maybe check input?\nError Log:\`${exception}\``)
        }
    } else if (interaction.commandName == "upward-motion") {
        let sf = interaction.options.getInteger('round-to-sigfig')
        let vi = interaction.options.getString('initial-velocity')
        let vf = interaction.options.getString('final-velocity')
        let d = interaction.options.getString('height')
        let t = interaction.options.getString('time')
        let tT = interaction.options.getString('total-time')
        try {
            await interaction.deferReply(); // Use this to maximize time for all computations, also shows that bot is thinking
            // let temp = new VerticallyDownward(vi, vf, d, t, sf);
            let temp = new VerticallyUpward(vi, vf, d, t, tT, sf);
            // LATEX
            let formulas = [], attc = [], properEmbeds = [];
            for (let i = 0; i < temp.equationInLatex.length; i++) {
                let info = new Latex(temp.equationInLatex[i]);
                await info.main()
                formulas.push(info.pngBuffer)
            }
            formulas.forEach((latexPng, index) => {
                attc.push(new AttachmentBuilder(latexPng, { name: `latex_eq${index}.png` }))
                if (index == 0) {
                    properEmbeds.push({
                        description: temp.givenInfo, 
                        image: {
                            url: `attachment://latex_eq${index}.png`
                        }
                    })
                } else {
                    properEmbeds.push({
                        image: {
                            url: `attachment://latex_eq${index}.png`
                        }
                    })
                }
            })
            await interaction.reply({ embeds: properEmbeds, files: attc })
        } catch (exception) {
            console.error(exception)
            await interaction.reply(`Can't do physics [upward motion] i dunno, maybe check input?\nError Log:\`${exception}\``)
        }
    } else if (interaction.commandName == "horizontal-motion") {
        let sf = interaction.options.getInteger('round-to-sigfig')
        let vi = interaction.options.getString('initial-velocity')
        let vy = interaction.options.getString('vertical-velocity')
        let vf = interaction.options.getString('final-velocity')
        let d = interaction.options.getString('height')
        let r = interaction.options.getString('range')
        let t = interaction.options.getString('time')
        try {
            await interaction.deferReply(); // Use this to maximize time for all computations, also shows that bot is thinking
            let temp = new HorizontalProjection(vi, vy, vf, t, d, r, sf);
            // LATEX
            let formulas = [], attc = [], properEmbeds = [];
            for (let i = 0; i < temp.equationInLatex.length; i++) {
                let info = new Latex(temp.equationInLatex[i]);
                await info.main()
                formulas.push(info.pngBuffer)
            }
            formulas.forEach((latexPng, index) => {
                attc.push(new AttachmentBuilder(latexPng, { name: `latex_eq${index}.png` }))
                if (index == 0) {
                    properEmbeds.push({
                        description: temp.givenInfo, 
                        image: {
                            url: `attachment://latex_eq${index}.png`
                        }
                    })
                } else {
                    properEmbeds.push({
                        image: {
                            url: `attachment://latex_eq${index}.png`
                        }
                    })
                }
            })
            await interaction.reply({ embeds: properEmbeds, files: attc })
        } catch (exception) {
            console.error(exception)
            await interaction.reply(`Can't do physics [horizontal motion] i dunno, maybe check input?\nError Log:\`${exception}\``)
        }
    } else if (interaction.commandName == "projected-at-an-angle") {
        let sf = interaction.options.getInteger('round-to-sigfig')
        let angle = interaction.options.getInteger('angle')
        let vi = interaction.options.getString('initial-velocity')
        let maxHeight = interaction.options.getString('max-height')
        let tT = interaction.options.getString('total-time')
        let r = interaction.options.getString('range')
        let vf = interaction.options.getString('final-velocity')
        try {
            await interaction.deferReply(); // Use this to maximize time for all computations, also shows that bot is thinking
            let temp = new ProjectedAtAnAngle(vi, angle, vf, maxHeight, tT, r, sf);
            // LATEX
            let formulas = [], attc = [], properEmbeds = [];
            for (let i = 0; i < temp.equationInLatex.length; i++) {
                let info = new Latex(temp.equationInLatex[i]);
                await info.main()
                formulas.push(info.pngBuffer)
            }
            formulas.forEach((latexPng, index) => {
                attc.push(new AttachmentBuilder(latexPng, { name: `latex_eq${index}.png` }))
                if (index == 0) {
                    properEmbeds.push({
                        description: temp.givenInfo, 
                        image: {
                            url: `attachment://latex_eq${index}.png`
                        }
                    })
                } else {
                    properEmbeds.push({
                        image: {
                            url: `attachment://latex_eq${index}.png`
                        }
                    })
                }
            })
            await interaction.editReply({ embeds: properEmbeds, files: attc })
        } catch (exception) {
            console.error(exception)
            await interaction.reply(`Can't do physics [projected at an angle] i dunno, maybe check input?\nError Log:\`${exception}\``)
        }
    } else if (interaction.commandName == 'chemistry-table') {
        let solution = interaction.options.getString('solution')
        let massSolute = interaction.options.getString('mass-solute')
        let massSolvent = interaction.options.getString('mass-solvent')
        let massSolution = interaction.options.getString('mass-solution')
        let nSolute = interaction.options.getString('nsolute')
        let nSolvent = interaction.options.getString('nsolvent')
        let nfSolute = interaction.options.getString('nfsolute')
        let nfSolvent = interaction.options.getString('nfsolvent')
        let molality = interaction.options.getString('molality')
        let molarity = interaction.options.getString('molarity')
        let equivalentOfSolute = interaction.options.getString('equivalent-of-solute')
        let normality = interaction.options.getString('normality')       

        try {
            let temp = new ChemTable(solution, massSolute, massSolvent, massSolution, nSolute, nSolvent, nfSolute, nfSolvent, molality, molarity, equivalentOfSolute, normality) 
            await interaction.reply({embeds: [{
                fields: [{
                    name: "**Solution:**",
                    value: solution,
                },{ 
                    name: "**Table Output:**", 
                    value: temp.showOutput() 
                }]
            }]})
            // await interaction.reply(temp.showOutput())
        } catch (exception) {
            console.error(exception)
            await interaction.reply(`Can't solve the table, please add more info or check input?\nError Log: \`${exception}\``)
        }
    } else if (interaction.commandName == 'generate-image') {
        // let description = interaction.options.getString('prompt')
        // try {
        //     await interaction.deferReply(); // Use this to maximize time for all computations, also shows that bot is thinking       
        //     let imagesArray = await GenerateOpenAiImage(openai, description);
        //     // Set the same url (any url works) for both embeds so that it shows the 2 pics in 1 embed post
        //     let embed1 = new EmbedBuilder().setDescription(`_${description}_`).setURL('https://discordjs.org').setImage(imagesArray[0])
        //     let embed2 = new EmbedBuilder().setURL('https://discordjs.org').setImage(imagesArray[1])
        //     await interaction.editReply({ embeds: [embed1, embed2] })
        // } catch (exception) {
        //     console.error(exception)
        //     await interaction.reply(`OpenAI not working?\nError Log: \`${exception}\``)
        // }
    } else if (interaction.commandName == 'chatgpt') {
        // let description = interaction.options.getString('prompt')
        // try {
        //     await interaction.deferReply(); // Use this to maximize time for all computations, also shows that bot is thinking       
        //     // let response = await GenerateGPTchatText(chatgpt, description);
        //     let response = await chatgpt.sendMessage(description)
        //     // console.log(response)
        //     // Set the same url (any url works) for both embeds so that it shows the 2 pics in 1 embed post
        //     // let embed1 = new EmbedBuilder().setDescription(`_${description}_`).setURL('https://discordjs.org').setImage(imagesArray[0])
        //     // let embed2 = new EmbedBuilder().setURL('https://discordjs.org').setImage(imagesArray[1])
        //     await interaction.editReply(`Prompt: \`${description}\`\n\n${response}`);
        // } catch (exception) {
        //     console.error(exception)
        //     await interaction.reply(`ChatGPT not working?\nError Log: \`${exception}\``)
        // }
    } else if (interaction.commandName == 'electrostatics') {
        let charges = interaction.options.getString('charges')
        let distance = interaction.options.getString('distance')
        let radiusEquation = interaction.options.getString('radiusEquation')

        try {
            let temp = new Electrostatics(charges, distance, radiusEquation) 
            // LATEX
            let [formula1, formula2] = [new Latex(temp.totalChargeLatex), new Latex(temp.finalChargeIdenticalLatex)];
            await formula1.main() // Evaluate all methods (main)
            await formula2.main()
            let [ attc1, attc2 ] = [new AttachmentBuilder(formula1.pngBuffer, { name: `latex_eq1.png` }), new AttachmentBuilder(formula2.pngBuffer, { name: `latex_eq2.png` })]
            
            // SEND!!!!!!!!
            await interaction.reply({ 
                embeds: [{ // Send embedded latex command
                    description: temp.info,
                    image: {
                        url: 'attachment://latex_eq1.png'
                    }
                }, {
                    image:  {
                        url: 'attachment://latex_eq2.png'
                    }
                }],
                files: [attc1, attc2]
            })

            // await interaction.reply(temp.showOutput())
        } catch (exception) {
            console.error(exception)
            await interaction.reply(`Can't solve electrostatics, please check input?\nError Log: \`${exception}\``)
        }
    }
});

// Main
(async() => {
    try {
        console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), { body: ListOfCommands });
		console.log('Successfully reloaded application (/) commands.');
        // Login to ChatGPT first, assign the global variable
        chatgpt = await InitiateChatGPT(OPENAI_EMAIL, OPENAI_PASSWORD, BROWSER_EXECUTABLE_PATH);
        // conversation = chatgpt.getConversation();
        // Login to Discord with your client's token
        client.login(TOKEN);
    } catch (err) {
        console.error(err);
    }
})();

