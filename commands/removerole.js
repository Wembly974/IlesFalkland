import chalk from 'chalk';

const requiredRole = 'Ancient Staff';

// Function to format the current date and time
const formatDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

// Main function to remove a role
export const removeRole = async (interaction) => {
    const member = interaction.guild.members.cache.get(interaction.user.id);

    // Check if the user has the required role
    if (!member.roles.cache.some(role => role.name === requiredRole)) {
        console.log(`${chalk.redBright.bold('[NO PERMISSION]')} -- ${formatDate()} - ( ${chalk.cyanBright(interaction.user.tag)} tried to use ${chalk.yellowBright(`/removerole`)} )`);
        return await interaction.reply({
            content: "**- You don't have permission to do this.**",
            ephemeral: true
        });
    }

    const roleNameInput = interaction.options.getString('role');
    const targetUser = interaction.options.getUser('user');

    // Fetch the target user’s member object
    const targetMember = await interaction.guild.members.fetch(targetUser.id);
    const role = targetMember.roles.cache.find(r => r.name.toLowerCase() === roleNameInput.toLowerCase());

    // Check if the role exists and if the target user has it
    if (!role) {
        return interaction.reply({
            content: `The role "${roleNameInput}" does not exist on this user.`,
            ephemeral: true,
        });
    }

    try {
        await targetMember.roles.remove(role); // Remove the role from the user

        // Send confirmation message to the target user
        await targetUser.send(`The role **${role.name}** has been removed from you in ${interaction.guild.name}.`);
        await interaction.reply({
            content: `Role **${role.name}** has been successfully removed from ${targetUser}.`,
            ephemeral: true,
        });

    } catch (error) {
        console.error('Error removing role:', error);
        await interaction.reply({
            content: 'An error occurred while removing the role.',
            ephemeral: true,
        });
    }
};

// Autocomplete handler for roles the target user has
export const handleRemoveRoleAutocomplete = async (interaction) => {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const targetUser = interaction.options.getUser('user');

    if (!targetUser) {
        await interaction.respond([]);
        return;
    }

    // Fetch the target user's roles
    const targetMember = await interaction.guild.members.fetch(targetUser.id);
    const roles = targetMember.roles.cache
        .filter(role => role.name.toLowerCase().includes(focusedValue)) // Filter roles based on user input
        .map(role => ({ name: role.name, value: role.name })) // Map to required format
        .slice(0, 25); // Limit to 25 choices

    await interaction.respond(roles); // Respond with filtered roles
};
