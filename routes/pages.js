const express = require('express');
const User = require('../core/user');
const router = express.Router();


const user = new User();

// näytä etusivu sivun avautuessa
router.get('/', (req, res, next) => {
    let user = req.session.user;
    // Jos käyttäjä on jäänyt kirjautuneena sisään hän siirtyy suoraan etusivulle ilman kirjautumisvaatimusta
    if(user) {
        res.redirect('/home');
        return;
    }
    // jos ei ole kirjautunut näytetään etusivu index
    res.render('index', {title:"Word Domination"});
})

// näytä kotisivu
router.get('/home', (req, res, next) => {
    let user = req.session.user;

    if(user) {
        res.render('home', {opp:req.session.opp, name:user.fullname});

        return;
    }



    res.redirect('/');
});

// Postaa kirjautumis data
router.post('/login', (req, res, next) => {

    user.login(req.body.username, req.body.password, function(result) {
        if(result) {
            // varastoidaan kirjautumisdata
            req.session.user = result;
            req.session.opp = 1;
            res.redirect('/home');
        }else {
            // jos käyttäjätunnus ja salasana eivät matchaa
            res.send('Käyttäjätunnus ja salasana eivät täsmää! Kokeile uudestaan.');
        }
    })

});


// Postaa rekisteröinti tiedot
router.post('/register', (req, res, next) => {
    // katsotaan käyttäjän syöttämät tiedot kenttiin
    let userInput = {
        username: req.body.username,
        fullname: req.body.fullname,
        sahkoposti: req.body.sahkoposti,
        password: req.body.password
    };
    // kutsutaan käyttäjän luonti funktiota
    user.create(userInput, function(lastId) {
        // käyttäjälle id
        if(lastId) {
           //  käyttäjä data idstä ja varastoidaan se
            user.find(lastId, function(result) {
                req.session.user = result;
               req.session.opp = 0;
                res.redirect('/home');
            });

        }else {
           console.log('uuden käyttäjän luomisessa virhe');
        }
    });

});

// kirjaudu ulos
router.get('/loggout', (req, res, next) => {
    // onko kirjautunut sisään?
    if(req.session.user) {
        // kirjataan käyttäjän sessio loppuneeksi ja ohjataan alkuun
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});



//tarinan luominen
router.post('/newstory', (req, res, next) => {
    // katsotaan käyttäjän syöttämät tiedot kenttiin
    let userInput = {
        otsikko: req.body.otsikko,
        genre: req.body.genre,
        teaser: req.body.teaser
    };

    // kutsutaan käyttäjän luonti funktiota
    user.story(userInput, function(storyID) {
        // Tarinalle id
        if(storyID) {
            // ohjataan käyttäjä takaisin tarinan luomisen jälkeen
            user.find(storyID, function(result) {

                res.redirect('/home');
            });

        }else {
            console.log('Tarinan luomisessa virhe');
        }
    });

});

//navbar ohjaukset









module.exports = router;