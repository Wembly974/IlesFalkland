import { PermissionsBitField, EmbedBuilder } from 'discord.js';
import chalk from 'chalk';
const date = new Date();
const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
export const clear = async (interaction) => {
    const numberOfMessages = interaction.options.getInteger('amount');
    const logChannelId = '1300903075841835008'; // Replace with your log channel ID
    const logChannel = interaction.guild.channels.cache.get(logChannelId);
    const requiredRole = 'Ancient Staff'; // Adjust role name/ID accordingly
    const member = interaction.guild.members.cache.get(interaction.user.id);

    // Check if user has the required role
    if (!member.roles.cache.some(role => role.name === requiredRole)) {
        console.log(`${chalk.redBright.bold('[NO PERMISSION]')} -- ${formattedDate} - ( ${chalk.cyanBright(interaction.user.tag)} try using --->${chalk.yellowBright(` /clear`)} )`);
        
        return await interaction.reply({
            content: "**- You don't have permission to do this.**",
            ephemeral: true
        });
    }

    // Check for valid number of messages
    if (!numberOfMessages || numberOfMessages < 1 || numberOfMessages > 100) {
        return await interaction.reply({
            content: 'Please provide a valid number between 1 and 100.',
            ephemeral: true,
        });
    }

    try {
        const fetchedMessages = await interaction.channel.bulkDelete(numberOfMessages, true); // Bulk delete
        const channelLink = `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`;

        // Reply to user
        await interaction.reply({
            content: `Successfully deleted ${fetchedMessages.size} messages.`,
            ephemeral: true,
        });

        // Log message in embed format
        const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Messages Cleared')
        .setDescription(`**${fetchedMessages.size}** messages were deleted by <@${interaction.user.id}>.`)
        .addFields(
            { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: false },
            { name: 'Messages Deleted', value: `${fetchedMessages.size}`, inline: false },
        )
        .setFooter({ text: `IlesFalkland 🍋`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();
    

        // Send embed to the log channel
        if (logChannel) {
            await logChannel.send({ embeds: [embed] });
        }

        // Log to console
        console.log(`${chalk.greenBright('[CLEAR]')} -- Deleted ${fetchedMessages.size} messages in ${interaction.channel.name} (${channelLink}).`);

    } catch (error) {
        console.error(`${chalk.redBright('[ERROR]')} -- Failed to delete messages:`, error);
        await interaction.reply({
            content: 'An error occurred while deleting messages.',
            ephemeral: true,
        });
    }
};
