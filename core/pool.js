const util = require('util');
const mysql = require('mysql');

//Databaseen yhdistämistietoja

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '********',
    database: 'projektiDB'
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