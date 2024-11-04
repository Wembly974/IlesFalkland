import chalk from 'chalk';

export const addRole = async (interaction) => {
    const targetUser = interaction.options.getUser('user');
    const selectedRoleId = interaction.options.getString('role'); // Get role ID
    const requiredRole = 'Ancient Staff';
    const member = interaction.guild.members.cache.get(interaction.user.id);

    if (!member.roles.cache.some(role => role.name === requiredRole)) {
        console.log(`${chalk.redBright.bold('[NO PERMISSION]')} - ${chalk.cyanBright(interaction.user.tag)} tried to use /addrole`);
        return await interaction.reply({ content: "You don't have permission to do this.", ephemeral: true });
    }

    const role = interaction.guild.roles.cache.get(selectedRoleId); // Use role ID directly
    if (!role) {
        return await interaction.reply({ content: `Role does not exist in this server.`, ephemeral: true });
    }

    try {
        const targetMember = await interaction.guild.members.fetch(targetUser.id);
        await targetMember.roles.add(role);

        await targetUser.send(`You have been assigned the role **${role.name}** in ${interaction.guild.name}.`);
        await interaction.reply({ content: `Role **${role.name}** has been successfully assigned to ${targetUser}.`, ephemeral: true });
    } catch (error) {
        console.error('Error assigning role:', error);
        await interaction.reply({ content: 'An error occurred while assigning the role.', ephemeral: true });
    }
};

// Autocomplete handler for role selection
export const handleAutocomplete = async (interaction) => {
    const focusedOption = interaction.options.getFocused(true);

    if (focusedOption.name === 'role') {
        const roles = interaction.guild.roles.cache
            .filter(role => !role.managed && !role.tags?.botId) // Exclude bot-managed roles
            .map(role => ({
                name: role.name,
                value: role.id // Use role ID for value
            }))
            .slice(0, 25);

        await interaction.respond(roles);
    }
};
