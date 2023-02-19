const ct = require('console.table');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'bootcamp',
    password: 'fullstack',
    database: 'exployee_emploiter'
});

// create the SQL connection 

class SqlConnect {
    constructor(level) {
        this.level = level;

    }

};

class ViewRecords  extends SqlConnect {
    constructor(level){
        super(level, connection);
        this.level = this.level.substring(0, this.level.length-1).toLowerCase();
        var sql = "SELECT * FROM " + this.level;
        connection.promise().query(sql)
        .then(([rows, fields]) => {
                const table = ct.getTable(rows);
                console.log(table);
        })
        .then((table) => {
            
        })            
}
};

class AddRecords extends SqlConnect {
    constructor(level) {
        super(level);
        console.log(this.level);
    }
};

class UpdateRecords extends SqlConnect {
    constructor(level) {
        super(level);
        console.log(this.level);
    }
};

module.exports = { SqlConnect, ViewRecords, AddRecords, UpdateRecords };