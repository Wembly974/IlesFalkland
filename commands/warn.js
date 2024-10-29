import { EmbedBuilder } from 'discord.js';
import fs from 'fs';
import { addPoints, getPoints, setPoints } from '../utils/pointsManager.js'; // Adjust the path accordingly
import chalk from 'chalk';
const date = new Date();
const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

export const warn = async (interaction) => {
    const requiredRole = 'Ancient Staff'+'🏅» Officer'+'👑» Leader'; // Replace with the name or ID of the role
    const member = interaction.guild.members.cache.get(interaction.user.id);

    // Check if the user has the required role
    if (!member.roles.cache.some(role => role.name === requiredRole)) {
        console.log(`${chalk.redBright.bold('[NO PERMISSION]')} -- ${formattedDate} - ( ${chalk.cyanBright(interaction.user.tag)} try using --->${chalk.yellowBright(` /warn`)} )`);
        return await interaction.reply({
            content: "**- You don't have permission to do this.**",
            ephemeral: true // Make the message visible only to the user
        });        
    }
    const warnedUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    // Check if the user exists
    if (!warnedUser) {
        return await interaction.reply({ content: "User not found. Please mention a valid user to warn.", ephemeral: true });
    }
    const user = interaction.client.users.cache.get(warnedUser.id);
    if (user) {
        user.send(`You have been warned for the following reason: ${reason}.`);
    }

    // Apply the "Warned" role to the user
    const guildMember = interaction.guild.members.cache.get(warnedUser.id);
    if (guildMember) {
        const warnedRole = interaction.guild.roles.cache.find(role => role.name === "Warned");
        if (!warnedRole) {
            // Create the "Warned" role if it doesn't exist
            try {
                const newRole = await interaction.guild.roles.create({
                    name: "Warned",
                    color: "#FF0000",
                    reason: "Role for warned users"
                });
                guildMember.roles.add(newRole);
            } catch (error) {
                console.error("Failed to create Warned role:", error);
                return await interaction.reply({ content: "Failed to create the 'Warned' role. Please ensure I have permissions to manage roles.", ephemeral: true });
            }
        } else {
            // Add the existing "Warned" role
            guildMember.roles.add(warnedRole);
        }
    }

    // Reply to the interaction to confirm the warning
    await interaction.reply({ content: `Warned ${warnedUser.username}. Reason: ${reason}. Their points have been halved and the 'Warned' role has been applied.`, ephemeral: true });
};
