// Load packages and modules
const inquirer = require('inquirer');
const Records = require('./display.js');
const ct = require('console.table');
const queries = require('./sql');

// First prompt - main menu

function mainMenu() {
    inquirer
    .prompt([
        {
        type: 'list',
        name: 'main_menu',
        message: 'What would you like to do, o Lord?',
        choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee', 'Quit'],
        loop: 'true',
        }])
        .then((data) => {
            const choice = data.main_menu.split(" ");
            const action = choice[0];
            const level = choice[1];
            switch(action) {
                case 'View':
                    var levelClean = level.toLowerCase();
                    levelClean = levelClean.substring(0, levelClean.length-1);
                    var table = queries.viewQuery(levelClean)
                    table.then(function(results) {
                        results = ct.getTable(results);
                        console.log(results);
                        renderPrompt();
                    });
                    break;
                case 'Add':
                    console.log("Add");
                    var recordAct = new Records.AddRecords(level);
                    // renderPrompt();
                    break;
                case 'Update':
                    console.log("Update");
                    var recordAct = new Records.UpdateRecords(level);
                    renderPrompt();
                    break;
                case 'Quit':
                    process.exit();
            }
            return recordAct;
        })
        }

function renderPrompt() {
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Continue? (No to quit):',
                default: true,
            }
        ])
        .then((data) => {
            if(data.confirm == true) {
                mainMenu();
            } else {
                process.exit();
            }
        })
}


mainMenu();