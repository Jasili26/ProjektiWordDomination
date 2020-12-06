const pool = require('./pool');
const bcrypt = require('bcrypt');


function User() {};

User.prototype = {
    // etsi käyttäjästä dataa idn tai kayttajatunnuksen avulla
    find : function(user = null, callback)
    {

        if(user) {

            var field = Number.isInteger(user) ? 'id' : 'username';
        }
        // db kyselyn alustus
        let sql = `SELECT * FROM users WHERE ${field} = ?`;


        pool.query(sql, user, function(err, result) {
            if(err) throw err

            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },


    // funktio joka syöttää dataa databaseen tunnuksen tekemisestä

    create : function(body, callback)
    {

        var pwd = body.password;
        // tietosuojataan salasana ja rikotaan se tietokantaan
        body.password = bcrypt.hashSync(pwd,10);


        var bind = [];

        for(prop in body){
            bind.push(body[prop]);
        }
        // lisätään käyttäjän syötetyt datat users tauluun
        let sql = `INSERT INTO users(username, fullname, email, password) VALUES (?, ?, ?, ?)`;

        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            // katsotaan edellinen id
            callback(result.insertId);
        });
    },

    login : function(username, password, callback)
    {
        // etsitään käyttäjä dataa käyttäjätunnuksesta
        this.find(username, function(user) {
            // jos on samanniminen käyttäjä
            if(user) {
                // katotaan salasanaa
                if(bcrypt.compareSync(password, user.password)) {
                    // näytä data
                    callback(user);
                    return;
                }
            }
            // jos salasana ja käyttäjätunnus ei matchaa
            callback(null);
        });

    },
    story : function(body, callback)
    {




        var bind = [];

        for(prop in body){
            bind.push(body[prop]);
        }
        // lisätään käyttäjän syötetyt datat story tauluun + ready = 0(ei valmis)
        let sql = `INSERT INTO story(header, genre, teaser, ready) VALUES (?, ?, ?, 0)`;

        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            // katsotaan edellinen id
            callback(result.insertId);
        });
    },

}

module.exports = User;