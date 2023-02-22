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
                    console.log("Successfully added "+ values['employee_first'] + " " + values['employee_last'] + " as a " + values['role']);
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
                    console.log("Successfully added " + values.department_name + " to the list of departments");
                    
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
                    if(values['management']) {
                        var m = " management role";
                    } else {
                        var m = " role";
                    };
                    console.log("Succesfully added the " + values['role_title'] + m + " to the system.")
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

    async update(callback) {
        inquirer
            .prompt([
                {
                    message: 'Choose employee:',
                    type: 'list',
                    name: 'employee',
                    choices: async function(employees) {
                        employees = await queries.employeeQuery(this.level);
                        return employees;
                    }
                },
                {
                    message: 'Change Role',
                    type: 'list',
                    name: 'role',
                    //this works fine, too.
                    choices: async function(roles) {
                        var roles = await queries.roleQuery(this.level);
                        return roles;
                        },
                },   
            ])
            .then((answers) => {
                let updates = answers;
                let sql = "UPDATE employee SET role_id = " + updates.role + " WHERE id = " + answers.employee + ";";
                console.log(sql);
                queries.sqlInject(sql);
            })
            .finally(() => {
                callback(true)
            })            
    }
}

class ViewRecords extends SqlConnect {
    constructor(level) {
        super(level);
        this.level = this.level.substring(0, this.level.length-1);
    }
    async view(callback) {
            switch(this.level) {
                case 'employee':
                    var sqlView = 'SELECT t1.id AS "Employee ID", CONCAT(t1.first_name, " ", t1.last_name) AS "Employee Name", role.title AS "Position", role.salary AS "Salary", department.name AS "Department", CONCAT(t2.first_name, " ", t2.last_name) AS "Manager" FROM  employee AS t1 LEFT JOIN employee AS t2 ON t1.manager_id = t2.id JOIN role ON t1.role_id = role.id JOIN department ON role.department_id = department.id;';  
                    var results = await queries.viewQuery(sqlView)
                    .then((results) => {callback(results)});
                    break;          
                case 'role':
                    var sqlView = 'SELECT role.title AS "Title", role.salary AS "Salary", role.management AS "management", department.name AS Department FROM role JOIN department ON role.department_id = department.id';           
                    var result = await queries.viewQuery(sqlView)
                    .then((results) => {
                        results = results;
                        for(let i = 0; i < results.length; i++) {
                            if(results[i].management == 1) {
                                results[i].management = "Yes";
                            } else { results[i].management = "No"}
                        }
                        return results;
                    })
                    .then((results) => {callback(results)});
                    break;
                case 'department':
                    var sqlView = 'SELECT * FROM department';
                    var results = await queries.viewQuery(sqlView)
                    .then((results) => {callback(results)});
                    break;    
            };
        }    
}

module.exports = { ViewRecords, SqlConnect, AddRecords, UpdateRecords };