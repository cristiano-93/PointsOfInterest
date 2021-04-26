const mysql = require('mysql2');
require('dotenv').config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DBASE
});

con.connect( err => {
    if(err){
        console.log(err);
        process.exit(1);
    }else {
        console.log('connected to mysql');
    }
});
module.exports = con;