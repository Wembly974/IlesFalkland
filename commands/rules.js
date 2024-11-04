import { EmbedBuilder } from 'discord.js';
import chalk from 'chalk';

const date = new Date();
const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

export const srules = async (interaction, client) => {
    const requiredRole = 'Ancient Staff';
    const member = interaction.guild.members.cache.get(interaction.user.id);

    // Check for permissions
    if (!member.roles.cache.some(role => role.name === requiredRole)) {
        console.log(`${chalk.redBright.bold('[NO PERMISSION]')} -- ${formattedDate} - ( ${chalk.cyanBright(interaction.user.tag)} tried to use ${chalk.yellowBright(`/cmdmod`)} )`);
        return await interaction.reply({
            content: "**- You don't have permission to do this.**",
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setTitle('===== Rules of conduct on Discord =====')
        .setColor('#00FF00')
        .addFields(
            { name: 'A. Language', value: '➥ Respect between players is very important 💯\n➥ Prefer common language (minimum) and sustained language to colloquial language 👍\n➥ Avoid polemical subjects (religion, politics...) 😬\n➥ Foreign language 🚫\n➥ Sexist, racist, homo/bi/hetero/(other)phobic remarks, inciting hatred/depression/suicide/murder 🚫\n➥ Insults and vulgar words 🚫', inline: false },
            { name: 'B. Writing', value: '➥ Capitalized sentences 🚫\n➥ Repetitive sentences 🚫\n➥ Flooding and spam 🚫\n➥ Copy-paste long texts 🚫\n➥ Links to harmful/unknown sites 🚫\n➥ Excessive role mentions 🚫', inline: false },
            { name: "**C. A l'oral**", value: '➥ Trolling 🚫\n➥ Auditory disturbances (screaming, shrill noises) 🚫\n➥ Voice modifiers/soundboards 🚫', inline: false }
        );

    const CHANNEL_ID = '1300119554223116391';
    const channel = client.channels.cache.get(CHANNEL_ID);

    if (channel) {
        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: 'Rules have been sent to the channel!', ephemeral: true });
    } else {
        console.log('Channel not found');
    }
};
