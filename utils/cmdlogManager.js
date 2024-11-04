import fs from 'fs';
import path from 'path';
import chalk from 'chalk'; // Import chalk for colored console output

const logsFilePath = path.join('logs', '.log'); // Adjust the path accordingly

// Load logs from JSON file
const loadLogs = () => {
    if (fs.existsSync(logsFilePath)) {
        const data = fs.readFileSync(logsFilePath);
        return JSON.parse(data);
    }
    return [];
};

// Save logs to JSON file
const saveLogs = (logs) => {
    try {
        fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error('Error saving logs:', error);
    }
};

// Initialize logs array
const logs = loadLogs();

// Function to log command usage
export const logCommand = (commandName, user) => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    
    const logEntry = `[COMMAND USED] -- ${formattedDate}: /${commandName} by ${user.tag}`;
    
    // Log to console with date and chalk formatting
    console.log(`${chalk.magentaBright.bold('[COMMAND USED]')} -- ${formattedDate} - ${chalk.yellowBright(`/${commandName}`)} - (${chalk.cyanBright(user.tag)})`);
    

    // Push to logs array and save
    logs.push(logEntry);
    saveLogs(logs);
};
