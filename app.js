const express = require('express');
const session = require('express-session');
const path = require('path');
const pageRouter = require('./routes/pages');
const app = express();


// Kerätään käyttäjältä lähetettyjä tietoja
app.use(express.urlencoded( { extended : false}));


// Jaetaan tiedostot publc kansiosta käyttöön
app.use(express.static(path.join(__dirname, 'public')));

app.use('/static', express.static(path.join(__dirname, 'public')))



// Template engine. PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// sessiot
app.use(session({
    secret:'kouluonkivaa',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));


// Routersit
app.use('/', pageRouter);


// Virheilmoituksen asettaminen
app.use((req, res, next) =>  {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
})

// Virheiden käsittely. Lähetetään käyttäjälle.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

// Asetetaan kuuntelemaan porttia
app.listen(3000, () => {
    console.log('Server is running on port 3000...');
});


module.exports = app;