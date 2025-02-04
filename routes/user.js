const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");

router.get('/signup', (req, res) => {
    res.render("users/signup");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust, " + registeredUser.username + "!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));


router.get('/login', (req, res) => {
    res.render("users/login");
});

router.post('/login',
    saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    async (req, res) => {
        //req.user is the user that was authenticated by passport
        req.flash("success", "Welcome back, " + req.user.username + "!");

        //redirecting back to the page where the user was trying to go
        // if redirectUrl is not set, it will redirect to /listings
        res.redirect(res.locals.redirectUrl || "/listings");
    }
);


router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
})

module.exports = router;
