import chalk from 'chalk';
const date = new Date();
const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
export const rank = async (interaction) => {
    const requiredRole = 'Ancient Staff'; // Replace with the name or ID of the role
    const member = interaction.guild.members.cache.get(interaction.user.id);

    // Check if the user has the required role
    if (!member.roles.cache.some(role => role.name === requiredRole)) {
        console.log(`${chalk.redBright.bold('[NO PERMISSION]')} -- ${formattedDate} - ( ${chalk.cyanBright(interaction.user.tag)} try using --->${chalk.yellowBright(` /cmdmod`)} )`);
        return await interaction.reply({
            content: "**- You don't have permission to do this.**",
            ephemeral: true // Make the message visible only to the user
        });
    }
    await interaction.deferReply({ ephemeral: true }); // Defer reply to prevent interaction failure

    const targetUser = interaction.options.getUser('user');
    const roleChoice = interaction.options.getString('role');

    // Map the role choices to actual role names
    const roleMap = {
        'role4': '👑» Leader',
        'role3': '🏅» Officer',
        'role2': '🥇» Member',
        'role1': '🚀» recruit'
    };

    const roleName = roleMap[roleChoice];
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);
    const logChannelId = '1302683954452762644'; // Your log channel ID here
    const logChannel = interaction.guild.channels.cache.get(logChannelId);

    if (!role) {
        return interaction.followUp({ content: `The role "${roleName}" does not exist in this server.`, ephemeral: true });
    }

    try {
        const member = await interaction.guild.members.fetch(targetUser.id);
        await member.roles.add(role);

        // Send a plain text log message with server emoji
        const message = await logChannel.send(`<:GG:1300891704802414646> to ${targetUser} who became ${role}!`);

        // Add a reaction with the server-specific emoji (replace "GG_EMOJI_ID" with the emoji ID)
        await message.react('<:GG:1300891704802414646>');

        await interaction.deleteReply(); // Remove the ephemeral reply after successful completion

    } catch (error) {
        console.error('Error ranking up member:', error);
        await interaction.followUp({ content: 'An error occurred while trying to rank up the member. Please try again later.', ephemeral: true });
    }
};
