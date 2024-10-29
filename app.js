import { Client, GatewayIntentBits, ActivityType, REST, Routes } from 'discord.js';
import commands from './commands.js'; // Your command definitions
import { logCommand } from './utils/cmdlogManager.js'; // Log commands utility
import chalk from 'chalk';

const CLIENT_ID = '1300896169500741786'; // Add your client ID
const GUILD_ID = '1299728255456116746'; // Add your guild (server) ID
const TOKEN = 'MTMwMDg5NjE2OTUwMDc0MTc4Ng.G7W3Gs.cKwlfsas7BFvRfl0CYyosuc2vuOIItk69UFRdI'; // Add your bot token
const AUTO_ROLE_ID = '1296580385991426058'; // Replace with the role ID you want to assign
//
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers // Include for detecting new members
    ]
});
//
client.once('ready', async () => {
    function clearScreen() {
        console.clear();
    }

    const botUserName = 'IlesFalkland 🍋';
    clearScreen();

    console.log(chalk.greenBright(`Done Login as ${chalk.redBright.bold('IlesFalkland 🍋')}`));
    console.log(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬${chalk.yellowBright('[ LOG ]')}▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);

    try {
        await client.user.setPresence({
            activities: [{ name: 'IlesFalkland 🍋', type: ActivityType.Playing }],
            status: 'dnd',
        });
        console.log(`${chalk.greenBright('[SUCCESS]')} -- ${chalk.redBright.bold(botUserName)} - ${chalk.cyanBright('Made by ( Wembly )')}`);
        console.log(`${chalk.redBright('[INFO]')} -- ${chalk.white('Status and activity set successfully')}`);
    } catch (error) {
        console.log(`${chalk.redBright('[ERROR]')} -- ${chalk.white("can't update the status")}}`, error);
    }

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        console.log(`${chalk.redBright('[INFO]')} -- ${chalk.white('starts refreshing all (/) command')}`);

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands.map(cmd => ({ name: cmd.name, description: cmd.description, options: cmd.options || [] })) }
        );

        console.log(`${chalk.greenBright('[SUCCESS]')} -- ${chalk.white('all (/) commands have been Successfully reloaded')}`);
    } catch (error) {
        console.error(`${chalk.redBright('[ERROR]')} -- ${chalk.white("can't reload the commands")}`, error);
    }
});

//
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

//
client.login(TOKEN);