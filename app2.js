const express = require('express');
const session = require('express-session');
const path = require('path');
const pageRouter = require('./routes/pages');
const app2 = express();


// Kerätään käyttäjältä lähetettyjä tietoja
app2.use(express.urlencoded( { extended : false}));


// Jaetaan tiedostot publc kansiosta käyttöön
app2.use(express.static(path.join(__dirname, 'public')));

app2.use('/static', express.static(path.join(__dirname, 'public')))



// Template engine. PUG
app2.set('views', path.join(__dirname, 'views'));
app2.set('view engine', 'pug');

// sessiot
app2.use(session({
    secret:'kouluonkivaa',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));


// Routersit
app2.use('/', pageRouter);


// Virheilmoituksen asettaminen
app2.use((req, res, next) =>  {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
})

// Virheiden käsittely. Lähetetään käyttäjälle.
app2.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

// Asetetaan kuuntelemaan porttia
app2.listen(3001, () => {
    console.log('Server is running on port 3001...');
});


module.exports = app2;