import { Client, GatewayIntentBits, ActivityType, REST, Routes } from 'discord.js';
import commands from './commands.js'; // Your command definitions
import { logCommand } from './utils/cmdlogManager.js'; // Log commands utility
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const TOKEN = process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers // Include for detecting new members
    ]
});

client.once('ready', async () => {
    function clearScreen() {
        console.clear();
    }

    const botUserName = 'IlesFalkland 🍋';
    clearScreen();

    console.log(chalk.greenBright(`Done Login as ${chalk.redBright.bold(botUserName)}`));
    console.log(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬${chalk.yellowBright('[ LOG ]')}▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);

    try {
        await client.user.setPresence({
            activities: [{ name: 'IlesFalkland 🍋', type: ActivityType.Playing }],
            status: 'dnd',
        });
        console.log(`${chalk.greenBright('[SUCCESS]')} -- ${chalk.redBright.bold(botUserName)} - ${chalk.cyanBright('Made by ( Wembly )')}`);
        console.log(`${chalk.redBright('[INFO]')} -- ${chalk.white('Status and activity set successfully')}`);
    } catch (error) {
        console.log(`${chalk.redBright('[ERROR]')} -- ${chalk.white("can't update the status")}`, error);
    }

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        console.log(`${chalk.redBright('[INFO]')} -- ${chalk.white('Starting to refresh all (/) commands')}`);

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands.map(cmd => ({ name: cmd.name, description: cmd.description, options: cmd.options || [] })) }
        );

        console.log(`${chalk.greenBright('[SUCCESS]')} -- ${chalk.white('All (/) commands have been successfully reloaded')}`);
    } catch (error) {
        console.error(`${chalk.redBright('[ERROR]')} -- ${chalk.white("Can't reload the commands")}`, error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.find(cmd => cmd.name === interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction);
            logCommand(interaction.commandName, interaction.user); // Log command usage
        } catch (error) {
            console.error(`${chalk.redBright('[ERROR]')} -- ${chalk.white(`Error executing command /${command.name}:`)}`, error);
            if (!interaction.replied) { // Check if the interaction has been replied to
                await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
            }
        }
    }
});

client.login(TOKEN);
