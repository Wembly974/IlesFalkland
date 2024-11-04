import { EmbedBuilder } from 'discord.js';
import axios from 'axios';
import chalk from 'chalk';
export const profile = async (interaction) => {
    const username = interaction.options.getString('username');

    try {
        // Make the API request to get user data
        const response = await axios.get(`https://publicapi.nationsglory.fr/user/${username}`, {
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer NGAPI_seNbqi9eph1Uc)m5wSZqQgDr$(2DPDg^6a616289f198d613a6582dd91c0b7f60' // Replace with your actual API key
            }
        });
        
        const playerData = response.data;
        const rubyServer = playerData.servers.lime;

        // Check if the player is on the Ruby server
        if (!rubyServer) {
            await interaction.reply({ content: `The user ${username} is not on the Lime server.`, ephemeral: true });
            return;
        }

        // Extract the first rank from the `groups` field within the `rubyServer` object
        const rank = (rubyServer.groups && rubyServer.groups.length > 0) 
            ? rubyServer.groups[0] // Get the first rank only
            : 'No rank found';

        // Build the embed with profile information and the rank
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`Profile Information for ${username}`)
            .setThumbnail('https://cdn.nationsglory.fr/default/assets/img/servers/lime.png') // Thumbnail image
            .addFields(
                { name: 'Username', value: username, inline: true },
                { name: 'Country', value: rubyServer.country || 'N/A', inline: true },
                { name: 'Rank', value: rubyServer.country_rank || 'N/A', inline: true },
                { name: 'Power', value: rubyServer.power.toString(), inline: true },
                { name: 'Max Power', value: rubyServer.max_power.toString(), inline: true },
                { name: 'Last Connection', value: rubyServer.last_connection || 'N/A', inline: true },
                { name: 'In-Game Rank', value: rank, inline: true } // Display only the first rank
            )
            .setURL(`https://nationsglory.fr/profile/${username}`) // Link to the profile
            .setTimestamp()
            .setFooter({ text: 'NationsGLory Lime', iconURL: 'https://cdn.nationsglory.fr/default/assets/img/servers/lime.png' });

        // Send the embed as a reply
        await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        console.error(`${chalk.redBright('[ERROR]')} -- Error fetching profile info:`, error.message);
        await interaction.reply({ content: `An error occurred while fetching profile information for **${username}**. Please try again later.`, ephemeral: true });
    }
};
