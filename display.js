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
    }
    async add(callback) {
             switch(this.level) {
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
                                var roleChoice = await queries.roleQuery(this.level);
                                return roleChoice;
                            }
                            },
                            {  
                                message: 'Pick their manager', 
                                type: 'list',
                                name: 'manager',
                                choices: async function(managers) {
                                    var managers = await queries.managerQuery(this.level);
                                    return managers;
                            }
                        }

                        ])
                        .then((answers) => {
                            let values = answers;
                            let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${values['employee_first']}", "${values['employee_last']}", ${values['role']}, ${values['manager']})`;
                            queries.sqlInject(sql);
                            console.log(values);
                            return;
                        })
                        .finally(() => {
                            callback(true)
                        }
                            )

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
                        .then((answers) => {
                            let values = answers;
                            let sql = `INSERT INTO department (name) VALUES ("${values['department_name']}");`;
                            queries.sqlInject(sql);
                            
                        })
                        .finally(() => {
                            callback(true)}
                            )
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
                                message: 'Is this a management role?',
                                type: 'confirm',
                                name: 'management',
                                default: false,
                            },
                            {
                                type: 'list',
                                name: 'department',
                                choices: async function(departments) {
                                    var departments = await queries.departmentQuery();
                                    return departments;
                                }
                            },
                        ])
                        .then((answers) => {
                            let values = answers;
                            let sql = `INSERT INTO role (title, salary, management, department_id) VALUES ("${values['role_title']}", ${values['salary']}, ${values['management']}, ${values['department']});`;
                            queries.sqlInject(sql);
                        })
                        .finally(() => {
                        callback(true)
                        })
            }
    }
}  
class UpdateRecords extends SqlConnect {
    constructor(level) {
        super(level);
    }
};


module.exports = { SqlConnect, AddRecords, UpdateRecords };