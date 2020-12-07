const util = require('util');
const mysql = require('mysql');
require('dotenv').config();

//Databaseen yhdistämistietoja

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection((err, connection) => {
    if(err)
        console.error("Databaseen ei saada yhteyttä, tiedoissa jotain vikaa?");

    if(connection)
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;