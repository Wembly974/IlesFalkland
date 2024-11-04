import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

export const wiki = async (interaction) => {
    const imagesDir = './wiki'; // Directory where the images are stored

    let embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('NationsGlory Wiki')
        .setDescription('Choose from the list what you need.')
        .setImage('https://cdn.nationsglory.fr/default/assets/img/servers/lime.png')
        .setFooter({ text: 'NationsGLory Lime' , iconURL: 'https://cdn.nationsglory.fr/default/assets/img/servers/lime.png'})
        .setURL(`https://wiki.nationsglory.fr/en/`);

    const selectMenuRow = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select_menu')
                .setPlaceholder('Choose here.')
                .addOptions([
                    { label: 'The countries', description: 'Learn about The countries', value: 'The countries' },
                    { label: 'The economy', description: 'Learn about The economy', value: 'The economy' },
                    { label: 'The skills', description: 'Learn about The skills', value: 'The skills' },
                    { label: 'Warzones', description: 'Learn about Warzones', value: 'Warzones' }
                ])
        );

    await interaction.reply({ embeds: [embed], components: [selectMenuRow], ephemeral: true });

    const selectCollector = interaction.channel.createMessageComponentCollector({ componentType: 3, time: 0 });

    selectCollector.on('collect', async (menuInteraction) => {
        const value = menuInteraction.values[0];
        let subMenuRow;

        // Determine submenu options
        switch (value) {
            case 'The countries':
                subMenuRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('sub_menu')
                            .setPlaceholder('Choose here')
                            .addOptions([
                                { label: 'How to Obtain a Country', value: 'How to Obtain a Country' },
                                { label: 'Research & Development', value: 'Research & Development' },
                                { label: 'The Power', value: 'The Power' },
                                { label: 'The Notation', value: 'The Notation' },
                                { label: 'The Empire', value: 'The Empire' },
                                { label: 'Back', value: 'back_to_main' }
                            ])
                    );
                break;

            case 'The economy':
                subMenuRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('sub_menu')
                            .setPlaceholder('Select a new option')
                            .addOptions([
                                { label: 'Market', value: 'Market' },
                                { label: 'Trading', value: 'Trading' },
                                { label: 'Back', value: 'back_to_main' }
                            ])
                    );
                break;

            case 'The skills':
                subMenuRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('sub_menu')
                            .setPlaceholder('Select a new option')
                            .addOptions([
                                { label: 'Miner', value: 'Miner' },
                                { label: 'Lumberjack', value: 'Lumberjack' },
                                { label: 'Farmer', value: 'Farmer' },
                                { label: 'Hunter', value: 'Hunter' },
                                { label: 'Builder', value: 'Builder' },
                                { label: 'Engineer', value: 'Engineer' },
                                { label: 'Back', value: 'back_to_main' }
                            ])
                    );
                break;

            case 'Warzones':
                subMenuRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('sub_menu')
                            .setPlaceholder('Select a new option')
                            .addOptions([
                                { label: 'Petrol', value: 'Petrol' },
                                { label: 'Mine', value: 'Mine' },
                                { label: 'Ship', value: 'Ship' },
                                { label: 'Back', value: 'back_to_main' }
                            ])
                    );
                break;

            case 'back_to_main':
                subMenuRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('select_menu')
                            .setPlaceholder('Select what you want to learn about.')
                            .addOptions([
                                { label: 'The countries', value: 'The countries' },
                                { label: 'The economy', value: 'The economy' },
                                { label: 'The skills', value: 'The skills' },
                                { label: 'Warzones', value: 'Warzones' }
                            ])
                    );
                break;

            default:
                subMenuRow = null; // Ensure no submenu is shown for invalid selections
                break;
        }

        await menuInteraction.deferUpdate(); // Acknowledge the interaction only once

        // Update the interaction with the submenu (only if subMenuRow is valid)
        if (subMenuRow) {
            await menuInteraction.editReply({ components: [subMenuRow] });
        }

        // Handle image sending based on sub-menu selection
        if (menuInteraction.customId === 'sub_menu') {
            let imagePaths = [];

            switch (menuInteraction.values[0]) { // Use menuInteraction.values[0] for submenu selections
                case 'How to Obtain a Country':
                    imagePaths = [
                        path.join(imagesDir, 'How-to-Obtain-a-Country1.png'),
                        path.join(imagesDir, 'How-to-Obtain-a-Country2.png')
                    ];
                    break;

                case 'Research & Development':
                    imagePaths = [
                        path.join(imagesDir, 'Research-and-Development1.png'),
                        path.join(imagesDir, 'Research-and-Development2.png')
                    ];
                    break;

                case 'The Power':
                    imagePaths = [
                        path.join(imagesDir, 'The-Power1.png'),
                        path.join(imagesDir, 'The-Power2.png')
                    ];
                    break;

                case 'The Notation':
                    imagePaths = [
                        path.join(imagesDir, 'The-Notation1.png'),
                        path.join(imagesDir, 'The-Notation2.png')
                    ];
                    break;

                case 'The Empire':
                    imagePaths = [
                        path.join(imagesDir, 'The-Empire1.png'),
                        path.join(imagesDir, 'The-Empire2.png')
                    ];
                    break;

                default:
                    return;
            }

            // Send images without any message
            for (const imagePath of imagePaths) {
                if (fs.existsSync(imagePath)) {
                    await menuInteraction.followUp({ files: [imagePath], ephemeral: true });
                } else {
                    console.error(`Image not found: ${imagePath}`);
                }
            }
        }
    });
};
