// Load packages and modules
const inquirer = require('inquirer');
const Records = require('./display.js');
const process = require('process');

// First prompt - main menu

function mainMenu() {
    inquirer
    .prompt([
        {
        type: 'list',
        name: 'main_menu',
        message: 'What would you like to do, o Lord?',
        choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee'],
        }])
        .then((data) => {
            const choice = data.main_menu.split(" ");
            const action = choice[0];
            const level = choice[1];
            switch(action) {
                case 'View':
                    console.log("View");
                    var recordAct = new Records.ViewRecords(level);
                    break;
                case 'Add':
                    console.log("Add");
                    var recordAct = new Records.AddRecords(level);
                    break;
                case 'Update':
                    console.log("Update");
                    var recordAct = new Records.UpdateRecords(level);
                    break;
            }
            return recordAct;
        })
        }

mainMenu();