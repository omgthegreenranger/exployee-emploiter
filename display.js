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
        var employees = await queries.employeeQuery(this.level);
        var roles = await queries.roleQuery(this.level);
        var managers = await queries.managerQuery(this.level);
        inquirer
            .prompt([
                {
                    message: 'Choose employee:',
                    type: 'list',
                    name: 'employee',
                    choices: employees
                },
                {
                    message: 'Change Role (Default Selected):',
                    type: 'list',
                    name: 'role',
                    choices: roles,
                    default: async ({employee}) => {
                        let empRole = employees.filter(obj => obj.value == employee)
                        employee = empRole[0].name
                        return employee;
                    }
                },   
                {   
                    message: 'Change Manager (Default Selected):',
                    type: 'list',
                    name: 'manager',
                    choices: managers,
                    default: async ({employee}) => {
                        let empMan = employees.filter(obj => obj.value == employee)
                        employee = empMan[0].name
                        return employee;
                    }

                }
            ])
            .then((answers) => {
                let updates = answers;
                let sql = "UPDATE employee SET role_id =" + updates.role + ", manager_id = " + updates.manager + " WHERE id = " + answers.employee + ";";
                queries.sqlInject(sql);            
                let roleName = roles.filter(obj => obj.value == updates.role);
                let empName = employees.filter(obj => obj.value == updates.employee);
                let empMan = managers.filter(obj => obj.value == updates.manager);
                if (updates.role == empName[0].role) {
                    console.log("You have not changed roles.");
                } else {
                    console.log("You have successfully moved " + empName[0].name + " to " + roleName[0].name)
                }
                if (updates.manager == empName[0].manager) {
                    console.log("You have not changed managers");
                } else {
                    console.log("You have successfully assigned " + empMan[0].name + " as manager to " + empName[0].name)
                }
                
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
        var managers = await queries.managerQuery();
        var departments = await queries.departmentQuery();
            switch(this.level) {
                case 'employee':
                    inquirer
                        .prompt([
                            {
                                message: 'View employees by',
                                type: 'list',
                                name: 'viewBy',
                                choices: ['Default', 'Manager', 'Department'],

                            }
                        ])
                        .then ((answers) => {
                            switch(answers.viewBy) {
                                case "Default":
                                    var sqlView = 'SELECT t1.id AS "Employee ID", CONCAT(t1.first_name, " ", t1.last_name) AS "Employee Name", role.title AS "Position", role.salary AS "Salary", department.name AS "Department", CONCAT(t2.first_name, " ", t2.last_name) AS "Manager" FROM  employee AS t1 LEFT JOIN employee AS t2 ON t1.manager_id = t2.id JOIN role ON t1.role_id = role.id JOIN department ON role.department_id = department.id;'; 
                                    var result = queries.viewQuery(sqlView)
                                    .then((results) => {callback(results)});
                                    break;
                                case "Manager":                                 
                                    inquirer
                                        .prompt([
                                            {
                                                message: 'Which manager to view',
                                                name: 'manager',
                                                type: 'list',
                                                choices: managers
                                            }
                                        ])
                                        .then((answers) => {
                                            answers = answers;
                                            var sqlView = 'SELECT t1.id AS "Employee ID", CONCAT(t1.first_name, " ", t1.last_name) AS "Employee Name", role.title AS "Position", role.salary AS "Salary", department.name AS "Department", CONCAT(t2.first_name, " ", t2.last_name) AS "Manager" FROM  employee AS t1 LEFT JOIN employee AS t2 ON t1.manager_id = t2.id JOIN role ON t1.role_id = role.id JOIN department ON role.department_id = department.id WHERE t1.manager_id = ' + answers.manager + ';';
                                            var result = queries.viewQuery(sqlView)
                                            .then((results) => {callback(results)});
                                        });
                                    break;
                                case "Department":
                                    inquirer
                                    .prompt([
                                        {
                                            message: 'Which department to view',
                                            name: 'department',
                                            type: 'list',
                                            choices: departments
                                        }
                                    ])
                                    .then((answers) => {
                                        answers = answers;
                                        var sqlView = 'SELECT t1.id AS "Employee ID", CONCAT(t1.first_name, " ", t1.last_name) AS "Employee Name", role.title AS "Position", role.salary AS "Salary", department.name AS "Department", CONCAT(t2.first_name, " ", t2.last_name) AS "Manager" FROM  employee AS t1 LEFT JOIN employee AS t2 ON t1.manager_id = t2.id JOIN role ON t1.role_id = role.id JOIN department ON role.department_id = department.id WHERE  role.department_id = ' + answers.department + ';';
                                        var result = queries.viewQuery(sqlView)
                                        .then((results) => {callback(results)});
                                    });                                
                                    break;
                            }
                        })
                    break;          
                case 'role':
                    var sqlView = 'SELECT role.title AS "Title", role.salary AS "Salary", role.management AS "Management", department.name AS Department FROM role JOIN department ON role.department_id = department.id';           
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
                    var sqlView = 'SELECT department.id AS "ID", department.name AS "Department", role.salary AS "Total Salary" FROM department JOIN role ON role.department_id = department.id JOIN employee ON employee.role_id = role.id GROUP BY role.salary;';
                    var results = await queries.viewQuery(sqlView)
                    .then((results) => {callback(results)});
                    break;    
            };
        }    
}

class DeleteRecords extends SqlConnect {
    constructor(level) {
        super(level);
    }

    async delete(callback) {
        var roles = await queries.roleQuery();
        var departments = await queries.departmentQuery();
        var employees = await queries.employeeQuery();
        inquirer
            .prompt([
            {
                message: 'Delete which record',
                type: 'list',
                name: 'delete',
                choices: ['Employee', 'Role', 'Department'],
            }
        ])
        .then ((answers) => {
            switch(answers.delete) {
                case "Employee":                                 
                inquirer
                    .prompt([
                        {
                            message: 'Delete employee:',
                            name: 'employee',
                            type: 'list',
                            choices: employees
                        }
                    ])
                    .then((answers) => {
                        answers = answers;
                        var sqlView = 'DELETE FROM employee WHERE id = ' + answers.employee + ';';
                        var result = queries.viewQuery(sqlView)
                        .then((results) => {
                            console.log("Employee safely deleted");
                            callback(results)});
                    });
                break;
                case "Role":                                 
                    inquirer
                        .prompt([
                            {
                                message: 'Delete Role',
                                name: 'role',
                                type: 'list',
                                choices: roles
                            }
                        ])
                        .then((answers) => {
                            answers = answers;
                            var sqlView = 'DELETE FROM role WHERE id = ' + answers.role + ';';
                            var result = queries.viewQuery(sqlView)
                            .then((results) => {
                                console.log("Role safely deleted");
                                callback(results)});
                        });
                    break;
                case "Department":
                    inquirer
                    .prompt([
                        {
                            message: 'Which department to view',
                            name: 'department',
                            type: 'list',
                            choices: departments
                        }
                    ])
                    .then((answers) => {
                        answers = answers;
                        var sqlView = 'DELETE FROM departments WHERE id = ' + answers.department + ';';
                        var result = queries.viewQuery(sqlView)
                        .then((results) => {
                            console.log("Department safely deleted");
                            callback(results)});
                    });                                
                    break;
            }
        })
    }
}
module.exports = { ViewRecords, SqlConnect, AddRecords, UpdateRecords, DeleteRecords };