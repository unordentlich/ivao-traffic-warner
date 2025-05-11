const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const json = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName('start').setDescription('Starts the bot').setIntegrationTypes(1).setContexts(1),
    new SlashCommandBuilder().setName('stop').setDescription('Stops the bot').setIntegrationTypes(1).setContexts(1),
    new SlashCommandBuilder()
        .setName('airport')
        .setDescription('Sets the current tracking airport')
        .setIntegrationTypes(1)
        .setContexts(1)
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The ICAO-Code of the airport')
                .setRequired(true)
        )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(json.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Loading Slash-Commands...');
        await rest.put(
            Routes.applicationCommands(json.CLIENT_ID),
            { body: commands },
        );
        console.log('Slash-Commands loaded!');
    } catch (error) {
        console.error(error);
    }
})();
