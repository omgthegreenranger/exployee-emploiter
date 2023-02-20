const ct = require('console.table');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const queries = require('./sql');


class SqlConnect {
    constructor(level) {
        this.level = level.toLowerCase();
    }

};

class AddRecords extends SqlConnect {
    constructor(level) {
        super(level);
            switch(this.level){
            case 'employee':
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'employee_first',
                            message: 'First Name:',
                        },
                        {
                            type: 'input',
                            name: 'employee_last',
                            message: 'Last Name:',
                        },
                        {

                            message: 'What role is this employee?',
                            type: 'list',
                            name: 'role',
                            choices: async function(roleChoice) {
                                var roleChoice = await queries.roleQuery(level);
                                return roleChoice;
                            }
                        },
                        {  
                            message: 'Pick their manager', 
                            type: 'list',
                            name: 'manager',
                            choices: async function(managers) {
                                var managers = await queries.managerQuery(level);
                                return managers;
                        }
                    }

                    ])
                    .then((answers) => {
                        let values = answers;
                        console.log(answers['role']);
                        let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${values['employee_first']}", "${values['employee_last']}", ${values['role']}, ${values['manager']})`;
                        console.log(sql);
                        queries.sqlInject(sql);
                    });

                break;
            case 'department':
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'department_name',
                            message: 'Department Name:',
                        },
                    
                    ])

                break;
        
            case 'role':
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'role_title',
                            message: 'Role Title:',
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'Salary:',
                        },
                        {
                            type: 'list',
                            name: 'department',
                            choices: ''
                        },
                    ])
        };
    }
};

class UpdateRecords extends SqlConnect {
    constructor(level) {
        super(level);
        console.log(this.level);
    }
};

module.exports = { SqlConnect, AddRecords, UpdateRecords };