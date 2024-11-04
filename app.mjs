import { Client, GatewayIntentBits, ActivityType, Routes } from 'discord.js';
import commands from './commands.js'; // Your command definitions
import { logCommand } from './utils/cmdlogManager.js'; // Log commands utility
import chalk from 'chalk';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Import node-fetch instead of undici


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
        GatewayIntentBits.GuildMembers // Required for detecting roles and members
    ]
});

client.once('ready', async () => {
    console.clear();
    const botUserName = 'IlesFalkland 🍋';

    console.log(chalk.greenBright(`Logged in as ${chalk.redBright.bold(botUserName)}`));
    console.log(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬${chalk.yellowBright('[ LOG ]')}▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);

    try {
        await client.user.setPresence({
            activities: [{name: '/support 🍋',type: ActivityType.Streaming,url: 'https://www.twitch.tv/nationsgloryfr'}],
            status: 'dnd',
        });

        console.log(`${chalk.greenBright('[SUCCESS]')} -- ${chalk.redBright.bold(botUserName)} - ${chalk.cyanBright('Made by ( Wembly )')}`);
        console.log(`${chalk.redBright('[INFO]')} -- ${chalk.white('Status and activity set successfully')}`);
    } catch (error) {
        console.log(`${chalk.redBright('[ERROR]')} -- ${chalk.white("Can't update the status")}`, error);
    }

    // Register commands with Discord using node-fetch
    try {
        console.log(`${chalk.redBright('[INFO]')} -- ${chalk.white('Starting to refresh all (/) commands')}`);

        const response = await fetch(
            `https://discord.com/api/v10/applications/${CLIENT_ID}/guilds/${GUILD_ID}/commands`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bot ${TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commands.map(cmd => ({
                    name: cmd.name,
                    description: cmd.description,
                    options: cmd.options || []
                })))
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to refresh commands: ${response.statusText}`);
        }

        console.log(`${chalk.greenBright('[SUCCESS]')} -- ${chalk.white('All (/) commands have been successfully reloaded')}`);
    } catch (error) {
        console.error(`${chalk.redBright('[ERROR]')} -- ${chalk.white("Can't reload the commands")}`, error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isAutocomplete()) {
        const focusedValue = interaction.options.getFocused().toLowerCase();

        // Fetch roles, filtering out managed roles and bot roles
        const roles = interaction.guild.roles.cache
            .filter(role => !role.managed && !role.members.some(member => member.user.bot))
            .map(role => ({ name: role.name, value: role.id }))
            .filter(role => role.name.toLowerCase().includes(focusedValue));

        await interaction.respond(roles.slice(0, 25));
        return;
    }

    if (!interaction.isCommand()) return;

    const command = commands.find(cmd => cmd.name === interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction, client);
            logCommand(interaction.commandName, interaction.user);
        } catch (error) {
            console.error(`${chalk.redBright('[ERROR]')} -- ${chalk.white(`Error executing command /${command.name}:`)}`, error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
            }
        }
    }
});

client.login(TOKEN);
