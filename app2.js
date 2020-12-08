const express = require('express');
const session = require('express-session');
const path = require('path');
const pageRouter = require('./routes/pages');
const app2 = express();
const fs      = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const cors = require('cors');


app2.enable('trust proxy');

app2.use(cors());
// parse application/x-www-form-urlencoded
app2.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app2.use(bodyParser.json());



// if production redirect to https
if (process.env.NODE_ENV === 'production') {
    app2.use((req, res, next) => {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // if express app run under proxy with sub path URL
            // e.g. http://www.myserver.com/app/
            // then, in your .env, set PROXY_PASS=/app
            // Adapt to your proxy settings!
            const proxypath = process.env.PROXY_PASS || '';
            // request was via http, so redirect to https
            console.log(`https://${req.headers.host}${proxypath}${req.url}`);
            res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
        }
    });
}


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

// if production, add https, with this if no need to install certs locally
if (process.env.NODE_ENV === 'production') {
    const sslkey = fs.readFileSync('/etc/pki/tls/private/ca.key');
    const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');
    const options = {
        key: sslkey,
        cert: sslcert
    };
    https.createServer(options, app2).listen(8001,
        () => console.log(`HTTPS on port ${8001}!`)); //https traffic
}



module.exports = app2;

