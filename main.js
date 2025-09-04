#!/usr/bin/env node
import Chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import clone from "./helpers/clone.js"
async function askQuestions() {
    console.log(
        Chalk.bgRed.white('starter-kit@1.1.1' + ' ' + Chalk.white('By Naimul Islam'),)
    )

    // Get folder name from command line arguments
    const folderName = process.argv[2];
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
