#!/usr/bin/env node
import inquirer from 'inquirer';
import * as fs from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import CreateDirectoryContents from './createDir.js';
import { exec } from 'child_process';
const CURR_DIR = process.cwd();

import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const questions = [
    {
        name: 'bot-name',
        type: 'input',
        message: 'What would you like to name your bot?',
        validate: function(input) {
            if(/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
            else 
                return 'Please enter a valid bot name';
        },
    },
    {
        name: 'bot-token',
        type: 'input',
        message: 'Please input your bot token:',
    },
    {
        name: 'dbtype',
        type: 'list',
        message: 'Which database would you like to use?',
        choices: CHOICES,
    },
];

console.log(chalk.blue(`
 ______   ______   ______   __  __   __   __   __ ______   __       _____    
/\  __ \ /\  == \ /\  ___\ /\ \_\ \ /\ \ /\ \ / //\  __ \ /\ \     /\  __-.  
\ \  __ \\ \  __< \ \ \____\ \  __ \\ \ \\ \ \'/ \ \  __ \\ \ \____\ \ \/\ \ 
 \ \_\ \_\\ \_\ \_\\ \_____\\ \_\ \_\\ \_\\ \__|  \ \_\ \_\\ \_____\\ \____- 
  \/_/\/_/ \/_/ /_/ \/_____/ \/_/\/_/ \/_/ \/_/    \/_/\/_/ \/_____/ \/____/ 
                                                                                                                                                                                                                                                                                           
`))

inquirer.prompt(questions).then(async answers => {
    const projectChoice = answers['dbtype'];
    const projectName = answers['bot-name'];
    const projectToken = answers['bot-token'];    
    const templatePath = `${__dirname}/templates/${projectChoice}`;

    if(answers.dbtype === 'MongoDB') {
        exec(`npm install mongoose`, (err, stdout, stderr) => {
            if (err) {
                console.log(`error: ${err.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    } else if (answers.dbtype === 'MySQL') {
        exec(`npm install mysql`, (err, stdout, stderr) => {
            if (err) {
                console.log(`error: ${err.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    }

    console.log(chalk.yellow(`Creating ${projectName} in ${CURR_DIR}`));
    fs.mkdirSync(`${CURR_DIR}/${projectName}`);
    console.log(chalk.green(`Created ${projectName} in ${CURR_DIR}`));

    console.log(chalk.yellow(`Creating .env file in ${CURR_DIR}/${projectName}`));
    fs.writeFileSync(`${CURR_DIR}/${projectName}/.env`, `TOKEN=${projectToken}`);
    console.log(chalk.green(`Created .env file in ${CURR_DIR}/${projectName}`));    

    CreateDirectoryContents(templatePath, projectName);
    
    console.log(`✔ ${chalk.green(`The project was successfully created in ${CURR_DIR}/${projectName}`)}`);
});