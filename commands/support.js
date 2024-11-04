import { EmbedBuilder } from 'discord.js';

export const support = async (interaction) => {
    const developerMentions = [
        '<@1232319957572915211>',
        '<@1057791023717298286>'
    ];

    const embed = new EmbedBuilder()
        .setTitle('Thank You!')
        .setThumbnail('https://cdn.nationsglory.fr/default/assets/img/servers/lime.png')
        .setDescription('A big thank you to everyone who participated in the creation of this Discord bot! Your support and contributions made it possible.')
        .addFields(
            { name: 'Developers', value: developerMentions.join(', '), inline: true },
            { name: 'Special Thanks', value: 'All users who provided feedback and testing!' }
        )
        .setColor('#00FF00') // Set the color to green
        .setFooter({ text: 'We appreciate your support!' , iconURL: 'https://cdn.nationsglory.fr/default/assets/img/servers/lime.png'})

    await interaction.reply({ embeds: [embed], ephemeral: true });
};
