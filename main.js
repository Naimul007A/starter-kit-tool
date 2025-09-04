#!/usr/bin/env node
import Chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import clone from "./helpers/clone.js"

const execAsync = promisify(exec);

function isDirectoryEmpty(dirPath) {
    try {
        const files = fs.readdirSync(dirPath);
        return files.length === 0;
    } catch (error) {
        return true; // If we can't read it, consider it empty
    }
}

async function emptyDirectory(dirPath) {
    try {
        // Change to the directory and remove all files and hidden files
        const command = `cd "${dirPath}" && rm -rf * && rm -rf .*`;
        await execAsync(command);
        console.log(Chalk.green(`Directory "${dirPath}" has been emptied successfully!`));
        return true;
    } catch (error) {
        console.error(Chalk.red(`Error emptying directory: ${error.message}`));
        return false;
    }
}

function showHelp() {
    console.log(Chalk.bgRed.white('starter-kit@1.2.1' + ' ' + Chalk.white('By Naimul Islam')));
    console.log('');
    console.log(Chalk.cyan('A quick command-line utility for NodeJS that helps quickly spin up new projects.'));
    console.log('');
    console.log(Chalk.yellow('Usage:'));
    console.log('  kit [folder-name]              Create a new project in the specified folder');
    console.log('  kit                            Create a new project in the current directory');
    console.log('');
    console.log(Chalk.yellow('Options:'));
    console.log('  -h, -H, --help                Show this help message');
    console.log('');
    console.log(Chalk.yellow('Available project types:'));
    console.log('  • laravel-vue                  Laravel with Vue.js frontend');
    console.log('  • laravel-bootstrap            Laravel with Bootstrap');
    console.log('  • python-flask                Python Flask application');
    console.log('  • node-ts                      Node.js with TypeScript');
    console.log('');
    console.log(Chalk.yellow('Examples:'));
    console.log('  kit my-project                 Create a new project in "./my-project" folder');
    console.log('  kit                            Create a new project in current directory');
    console.log('');
    console.log(Chalk.gray('For more information, visit: https://github.com/Naimul007A/starter-kit-tool'));
}

// Check for help flags
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h') || args.includes('-H') || args.includes('help')) {
    showHelp();
    process.exit(0);
}

async function askQuestions() {
    console.log(
        Chalk.bgRed.white('starter-kit@1.2.1' + ' ' + Chalk.white('By Naimul Islam'),)
    )

    // Get folder name from command line arguments (excluding help flags)
    const folderName = args.find(arg => !arg.startsWith('-') && arg !== 'help');
    let targetPath = process.cwd();

    if (folderName) {
        targetPath = path.resolve(process.cwd(), folderName);

        // Check if folder exists
        if (!fs.existsSync(targetPath)) {
            console.log(Chalk.yellow(`Folder "${folderName}" doesn't exist. Creating it...`));
            try {
                fs.mkdirSync(targetPath, { recursive: true });
                console.log(Chalk.green(`Folder "${folderName}" created successfully!`));
            } catch (error) {
                console.error(Chalk.red(`Error creating folder: ${error.message}`));
                return;
            }
        } else {
            console.log(Chalk.blue(`Using existing folder: ${folderName}`));

            // Check if the folder is not empty
            if (!isDirectoryEmpty(targetPath)) {
                console.log(Chalk.yellow(`Warning: Folder "${folderName}" is not empty!`));

                try {
                    const { shouldEmpty } = await inquirer.prompt([
                        {
                            type: "confirm",
                            name: "shouldEmpty",
                            message: `The folder "${folderName}" is not empty. Do you want to empty it before proceeding?`,
                            default: false
                        }
                    ]);

                    if (shouldEmpty) {
                        console.log(Chalk.yellow(`Emptying folder "${folderName}"...`));
                        const success = await emptyDirectory(targetPath);
                        if (!success) {
                            console.log(Chalk.red('Failed to empty the directory. Aborting...'));
                            return;
                        }
                    } else {
                        console.log(Chalk.red('Operation cancelled by user.'));
                        return;
                    }
                } catch (error) {
                    console.error(Chalk.red(`Error: ${error.message}`));
                    return;
                }
            }
        }
    } else {
        // If no folder name provided, check if current directory is empty
        if (!isDirectoryEmpty(targetPath)) {
            console.log(Chalk.yellow(`Warning: Current directory is not empty!`));

            try {
                const { shouldEmpty } = await inquirer.prompt([
                    {
                        type: "confirm",
                        name: "shouldEmpty",
                        message: `The current directory is not empty. Do you want to empty it before proceeding?`,
                        default: false
                    }
                ]);

                if (shouldEmpty) {
                    console.log(Chalk.yellow(`Emptying current directory...`));
                    const success = await emptyDirectory(targetPath);
                    if (!success) {
                        console.log(Chalk.red('Failed to empty the directory. Aborting...'));
                        return;
                    }
                } else {
                    console.log(Chalk.red('Operation cancelled by user.'));
                    return;
                }
            } catch (error) {
                console.error(Chalk.red(`Error: ${error.message}`));
                return;
            }
        }
    }

    try {
        const { projectLink } = await inquirer.prompt([
            {
                type: "list",
                name: "projectLink",
                message: 'What kind of project do you want to create?',
                choices: ["laravel-vue", "node-ts", "python-flask","laravel-bootstrap"],
            }
        ])
        switch (projectLink) {
            case 'laravel-vue':
                clone("laravel-vue", targetPath)
                break;
            case 'laravel-bootstrap':
                clone("laravel-bootstrap", targetPath)
                break;
            case 'python-flask':
                clone("python-flask", targetPath)
                break;
            case 'laravel-tailwind':
                clone("laravel-tailwind", targetPath)
                break;
            case 'node-ts':
                clone("node-ts", targetPath)
                break;
            default:
                clone('Please select a valid option', targetPath);
        }
    } catch (err) {
        console.error(err)
    }
}
askQuestions();
