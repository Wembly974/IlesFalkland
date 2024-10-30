import { clear } from './commands/clear.js';
import { warn } from './commands/warn.js';
import { tempmute } from './commands/tempmute.js';
import { rank } from './commands/rank.js';
import { derank } from './commands/derank.js';

const commands = [
    {
        name: 'clear',
        description: 'clear amout of messsages you put',
        options: [
            {
                name: 'amount',
                description: 'the number of messages to delete',
                type: 4, 
                required: true,
            },
        ],
        execute: clear,
    },
    {
        name: 'tempmute',
        description: 'Temporarily mute a user',
        options: [
            {
                name: 'user',
                description: 'The user to tempmute',
                type: 6, // User
                required: true,
            },
            {
                name: 'duration',
                description: 'The duration of the tempmute',
                type: 4, // Integer
                required: true,
            },
            {
                name: 'unit',
                description: 'The unit of the duration (second, minute, hour, day, month)',
                type: 3, // String
                required: true,
                choices: [
                    { name: 'seconds', value: 'seconds' },
                    { name: 'minutes', value: 'minutes' },
                    { name: 'hours', value: 'hours' },
                    { name: 'days', value: 'days' },
                    { name: 'months', value: 'months' },
                ],
            },
            {
                name: 'reason',
                description: 'The reason for the tempmute',
                type: 3, // String
                required: true,
            },
        ],
        execute: tempmute,
    },
    {
        name: 'warn',
        description: 'Warn a user and halve their points.',
        options: [
            {
                type: 6, // USER type
                name: 'user',
                description: 'The user to warn',
                required: true,
            },
            {
                type: 3, // STRING type
                name: 'reason',
                description: 'The reason for warning the user',
                required: true,
            },
        ],
        execute: warn,
        
    },
    {
        name: 'rank',
        description: 'Rank Up a member',
        options: [
            {
                name: 'user',
                description: 'User to rank up',
                type: 6, // User
                required: true,
            },
            {
                name: 'role',
                description: 'role to add',
                type: 3, // String
                required: true,
                choices: [
                    { name: '🚀» recruit', value: 'role1' },
                    { name: '🥇» Member', value: 'role2' },
                    { name: '🏅» Officer', value: 'role3' },
                    { name: '👑» Leader', value: 'role4' },
                ],
            },
        ],
        execute: rank,
    },
    
]
export default commands;