import { clear } from './commands/clear.js';//1
import { warn } from './commands/warn.js';//2
import { tempmute } from './commands/tempmute.js';//3
import { rank } from './commands/rank.js';//4
import { derank } from './commands/derank.js';//5
import { profile } from './commands/profile.js';//6
import { support } from "./commands/support.js";//7
import { srole } from "./commands/srole.js";//8
import { srules } from "./commands/rules.js";//9
import { addRole , handleAutocomplete} from './commands/addrole.js';//10
import { removeRole } from './commands/removerole.js';//11
import { wiki } from './commands/wiki.js';//12
const commands = [
    {
        name: "clear",
        description: "clear amout of messsages you put",
        options: [
            {
                name: "amount",
                description: "the number of messages to delete",
                type: 4,
                required: true,
            },
        ],
        execute: clear,
    },
    {
        name: "tempmute",
        description: "Temporarily mute a user",
        options: [
            {
                name: "user",
                description: "The user to tempmute",
                type: 6, // User
                required: true,
            },
            {
                name: "duration",
                description: "The duration of the tempmute",
                type: 4, // Integer
                required: true,
            },
            {
                name: "unit",
                description:
                    "The unit of the duration (second, minute, hour, day, month)",
                type: 3, // String
                required: true,
                choices: [
                    { name: "seconds", value: "seconds" },
                    { name: "minutes", value: "minutes" },
                    { name: "hours", value: "hours" },
                    { name: "days", value: "days" },
                    { name: "months", value: "months" },
                ],
            },
            {
                name: "reason",
                description: "The reason for the tempmute",
                type: 3, // String
                required: true,
            },
        ],
        execute: tempmute,
    },
    {
        name: "warn",
        description: "Warn a user and halve their points.",
        options: [
            {
                type: 6, // USER type
                name: "user",
                description: "The user to warn",
                required: true,
            },
            {
                type: 3, // STRING type
                name: "reason",
                description: "The reason for warning the user",
                required: true,
            },
        ],
        execute: warn,
    },
    {
        name: "rank",
        description: "RankUp a member",
        options: [
            {
                name: "user",
                description: "User to rank up",
                type: 6, // User
                required: true,
            },
            {
                name: "role",
                description: "role to add",
                type: 3, // String
                required: true,
                choices: [
                    { name: "👑» Leader", value: "role4" },
                    { name: "🏅» Officer", value: "role3" },
                    { name: "🥇» Member", value: "role2" },
                    { name: "🚀» recruit", value: "role1" }
                    
                    
                    
                ],
            },
        ],
        execute: rank,
    },
    {
        name: "derank",
        description: "DeRank a member",

        execute: derank,
    },
    {
        name: "support",
        description: "Display support and thanks to contributors",
        execute: support,
    },
    {
        name: 'profile',
        description: 'Get the profile link for a NationsGlory user',
        options: [
            {
                type: 3, // STRING type
                name: 'username',
                description: 'The username of the player',
                required: true,
            },
        ],
        execute: profile,
    },   
    {
        name: "srole",
        description: "test",
        execute: srole,
    },
        {
        name: "srule",
        description: "send rules",
        execute: srules,
    },
    {
        name: 'addrole',
        description: 'Assign a role to a user',
        options: [
            {
                name: 'user',
                description: 'The user to assign the role to',
                type: 6, // USER type
                required: true,
            },
            {
                name: 'role',
                description: 'The role to assign',
                type: 3, // STRING type
                required: true,
                autocomplete: true
            }
        ],
        execute: addRole,
        autocomplete: handleAutocomplete
    },

    {
        name: 'removerole',
        description: 'Remove a role from a user',
        options: [
           	{
                name: 'user',
                description: 'User to remove the role from',
                type: 6, // User type
                required: true
            },
            {
                name: 'role',
                description: 'Role to remove',
                type: 3, // String for role choices
                required: true,
                autocomplete: true
            }
        ],
        execute: removeRole,
   	},
        {
        name: 'wiki',
        description: 'to learn everything about NationsGlory',
        execute: wiki,
    },
    
]
export default commands;