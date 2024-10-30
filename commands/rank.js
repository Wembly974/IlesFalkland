export const rank = async (interaction) => {
    await interaction.deferReply({ ephemeral: true }); // Defer reply to prevent interaction failure

    const targetUser = interaction.options.getUser('user');
    const roleChoice = interaction.options.getString('role');

    // Map the role choices to actual role names
    const roleMap = {
        'role1': '🚀» recruit',
        'role2': '🥇» Member',
        'role3': '🏅» Officer',
        'role4': '👑» Leader'
    };

    const roleName = roleMap[roleChoice];
    const role = interaction.guild.roles.cache.find(r => r.name === roleName);
    const logChannelId = '1300124136923992095'; // Your log channel ID here
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
