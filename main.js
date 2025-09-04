#!/usr/bin/env node
import Chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import clone from "./helpers/clone.js"

function showHelp() {
    console.log(Chalk.bgRed.white('starter-kit@1.1.1' + ' ' + Chalk.white('By Naimul Islam')));
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
        Chalk.bgRed.white('starter-kit@1.1.1' + ' ' + Chalk.white('By Naimul Islam'),)
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
