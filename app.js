const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const port = 8080;

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
    .then(() => {
        console.log("connected to database");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

const sessionOptions = {
    secret: "airbnb123!@#$%^&*&^%",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 3600 * 24 * 7,
        maxAge: 1000 * 3600 * 24 * 7,
        httpOnly: true,
    }
};

app.get("/", (req, res) => {
    console.log("connected to server - /");
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


//ADDING LISTING ROUTES
app.use("/listings", listings);

//ADDING REVIEW ROUTES
app.use("/listings/:id/reviews", reviews);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { err });
});


app.listen(port, () => {
    console.log("listening to port " + port);
});