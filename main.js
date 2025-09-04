#!/usr/bin/env node
import Chalk from 'chalk';
import inquirer from 'inquirer';
import clone from "./helpers/clone.js"
async function askQuestions() {
    console.log(
        Chalk.bgRed.white('starter-kit@1.0.0' + ' ' + Chalk.white('By Naimul Islam'),)
    )
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
                clone("laravel-vue")
                break;
            case 'laravel-bootstrap':
                clone("laravel-bootstrap")
                break;
            case 'python-flask':
                clone("python-flask")
                break;
            case 'laravel-tailwind':
                clone("laravel-tailwind")
                break;
            case 'node-ts':
                clone("node-ts")
                break;
            default:
                clone('Please select a valid option');
        }
    } catch (err) {
        console.error(err)
    }
}
askQuestions();
