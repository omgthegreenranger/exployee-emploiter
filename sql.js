const ct = require('console.table');
const mysql = require('mysql2');
const sqlManager = 'SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON role.id = employee.role_id WHERE role.management = 1;'
const sqlRole = 'SELECT title, id FROM role';
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'bootcamp',
    password: 'fullstack',
    database: 'exployee_emploiter',
    waitForConnections: true,
    connectionLimit: 10,
    idleTimeout: 6000,
    queueLimit: 0
});
// queries for list values

async function roleQuery() {
    const [rows] = await pool.promise().query(sqlRole)
    var results = JSON.stringify(rows);
    results = results.replaceAll("title", "name");
    results = results.replaceAll("id", "value");
    results = JSON.parse(results);
    return results;
};

async function managerQuery() {
    const [rows] = await pool.promise().query(sqlManager)
    let managers = [];
    for(let i = 0; i < rows.length; i++) {
        newName = rows[i].first_name + " " + rows[i].last_name + ", " + rows[i].title;
        newID = rows[i].id;
        managers.push({"name": newName, "value": newID});
    }
    return managers;
    
    };

async function viewQuery(level) {
    // Remember to switch this depending on the level)
    const sqlView = 'SELECT * FROM ' + level;
    const [rows] = await pool.promise().query(sqlView);
    return rows;
};

function sqlInject(sqlParam) {
    pool.query(sqlParam);
    return;
}

module.exports = { roleQuery, managerQuery, viewQuery, sqlInject };