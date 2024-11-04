import { EmbedBuilder } from 'discord.js';
import chalk from 'chalk';
const date = new Date();
const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
export const tempmute = async (interaction) => {
    const requiredRole = 'Ancient Staff';
    const member = interaction.guild.members.cache.get(interaction.user.id);

    if (!member.roles.cache.some(role => role.name === requiredRole)) {
        console.log(`${chalk.redBright.bold('[NO PERMISSION]')} -- ${formattedDate} - ( ${chalk.cyanBright(interaction.user.tag)} try using --->${chalk.yellowBright(` /tempmute`)} )`);
        return await interaction.reply({
            content: "**- You don't have permission to do this.**",
            ephemeral: true
        });
        
    }

    const userId = interaction.options.getUser('user').id;
    const durationValue = interaction.options.getInteger('duration');
    const durationUnit = interaction.options.getString('unit');
    const reason = interaction.options.getString('reason');

    const user = interaction.guild.members.cache.get(userId);
    if (!user) return interaction.reply({ content: `User not found: ${userId}`, ephemeral: true });

    const muteRole = interaction.guild.roles.cache.find(role => role.name === 'TempMuted 🚫');
    if (!muteRole) return interaction.reply({ content: 'Muted role not found.', ephemeral: true });

    await interaction.deferReply({ ephemeral: true });
    await user.roles.add(muteRole);

    let durationInMilliseconds;
    switch (durationUnit) {
        case 'seconds':
            durationInMilliseconds = durationValue * 1000;
            break;
        case 'minutes':
            durationInMilliseconds = durationValue * 60 * 1000;
            break;
        case 'hours':
            durationInMilliseconds = durationValue * 60 * 60 * 1000;
            break;
        case 'days':
            durationInMilliseconds = durationValue * 24 * 60 * 60 * 1000;
            break;
        case 'months':
            durationInMilliseconds = durationValue * 30 * 24 * 60 * 60 * 1000;
            break;
        default:
            return interaction.followUp({ content: 'Invalid duration unit. Use second, minute, hour, day, or month.', ephemeral: true });
    }

    // Log the mute
    const logChannel = interaction.client.channels.cache.get('1300903075841835008');
    if (logChannel) {
        const muteEmbed = new EmbedBuilder()
            .setTitle(`Tempmute`)
            .setColor('#00FF00')
            .setThumbnail(user.user.displayAvatarURL())
            .addFields(
                { name: 'Username', value: `<@${userId}>`, inline: false },
                { name: 'Duration', value: `${durationValue} ${durationUnit}`, inline: false },
                { name: 'Reason', value: reason, inline: false }
            )
            .setFooter({ text: 'IlesFalkland 🍋' , iconURL: 'https://cdn.nationsglory.fr/default/assets/img/servers/lime.png'})
        await logChannel.send({ embeds: [muteEmbed] });
    }

    await user.send(`You have been tempmuted for **${durationValue} ${durationUnit}**. Reason: **${reason}**`);
    await interaction.followUp({ content: `You have tempmuted **${user.nickname || user.user.username}** for **${durationValue} ${durationUnit}**.`, ephemeral: true });

    setTimeout(async () => {
        try {
            await user.roles.remove(muteRole);
            console.log(`Removed TempMuted role from ${user.user.username} after ${durationValue} ${durationUnit}`);

            if (logChannel) {
                const unmuteEmbed = new EmbedBuilder()
                    .setTitle(`Unmute`)
                    .setColor('#00FF00')
                    .addFields(
                        { name: 'Username', value: `<@${userId}>`, inline: false },
                        { name: 'Status', value: `Mute duration has ended : **${durationValue} ${durationUnit}**`, inline: false }
                    );
                await logChannel.send({ embeds: [unmuteEmbed] });
            }
        } catch (error) {
            console.error(`Error removing TempMuted role: ${error}`);
        }
    }, durationInMilliseconds);
};
