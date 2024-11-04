import chalk from 'chalk';
const date = new Date();
const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
export const derank = async (interaction) => {
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
    return interaction.reply({
        content: `its not working yet`,
        ephemeral: true
    });
}
