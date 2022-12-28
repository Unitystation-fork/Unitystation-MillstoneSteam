const { Router} = require('express');
const passport = require('passport');
const User = require('');
const router = Router();

router.get('/discord', passport.authenticate('discord'), (reg, res) => {
    res.send(200);
})

router.get(
    '/discord/redirect',
    passport.authenticate('discord'),
    (req, res) => {
        res.send(200);
    }
);

module.exports = router;