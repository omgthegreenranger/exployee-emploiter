// Load packages and modules
const inquirer = require('inquirer');
const { AddRecords, UpdateRecords, ViewRecords, DeleteRecords } = require('./display.js');
const ct = require('console.table');

// First prompt - main menu

function mainMenu() {
    console.log(`
    _______ _            ______            _                        
   |__   __| |          |  ____|          | |                       
      | |  | |__   ___  | |__  __  ___ __ | | ___  _   _  ___  ___  
      | |  | '_ \\ / _ \\ |  __| \\ \\/ / '_ \\| |/ _ \\| | | |/ _ \\/ _ \\ 
      | |  | | | |  __/ | |____ >  <| |_) | | (_) | |_| |  __/  __/ 
      |_|  |_| |_|\\___| |______/_/\\_\\ .__/|_|\\___/ \\__, |\\___|\\___| 
                                    | |             __/ |                  
        ______                 _    |_|_ _         |___/                   
       |  ____|               | |     (_) |                       
       | |__   _ __ ___  _ __ | | ___  _| |_ ___ _ __             
       |  __| | '_ \` _  | '_ \\| |/ _ \\| | __/ _ \\ '__|        
       | |____| | | | | | |_) | | (_) | | ||  __/ |               
       |______|_| |_| |_| .__/|_|\\___/|_|\\__\\___|_|            
                                      | |                                       
                                      |_|  Your tool for professional domination\n\n`
   );

   inquirer
       .prompt([
            {
                type: 'list',
                name: 'main_menu',
                message: 'What would you like to do, o Lord?',
                choices: ['View Employees', 'Add Employee', 'Update Employee', 'View Roles', 'Add Role', 'View Departments', 'Add Department',  'Delete Records', 'Quit'],
                loop: 'true',
            }
        ])
        .then((data) => {
            const choice = data.main_menu.split(" ");
            const action = choice[0];
            const level = choice[1];
            switch(action) {
                case 'View':
                    const runView = new ViewRecords(level);
                    const doneView = runView.view(function(results) {
                            results = ct.getTable(results);
                            console.log(results);
                            renderPrompt();
                            })
                    break;
                case 'Add':
                    const runAdd = new AddRecords(level);
                    const doneAdd = runAdd.add(function(arg1) {
                        renderPrompt();
                    })
                    break;
                case 'Update':
                    const runUpdate = new UpdateRecords(level);
                    const doneUpdate = runUpdate.update(function(arg1) {
                        renderPrompt();
                    })
                    break;
                case 'Delete':
                    const runDelete = new DeleteRecords(level);
                    const doneDelete = runDelete.delete(function(arg1) {
                        renderPrompt();
                    })
                    break;
                case 'Quit':
                    process.exit();
            }
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
        
module.exports = { mainMenu };